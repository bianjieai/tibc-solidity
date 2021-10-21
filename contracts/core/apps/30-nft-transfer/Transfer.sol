// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../../proto/NftTransfer.sol";
import "../../../proto/Ack.sol";
import "../../02-client/ClientManager.sol";
import "../../../libraries/04-packet/Packet.sol";
import "../../../libraries/30-nft-transfer/NftTransfer.sol";
import "../../../libraries/utils/Bytes.sol";
import "../../../libraries/utils/Strings.sol";
import "../../../interfaces/IPacket.sol";
import "../../../interfaces/ITransfer.sol";
import "../../../interfaces/IERC1155Bank.sol";
import "../../../interfaces/IAccessManager.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract Transfer is Initializable, ITransfer, ERC1155HolderUpgradeable {
    using Strings for *;
    using Bytes for *;

    string private constant PORT = "NFT";
    string private constant PREFIX = "nft";
    bytes32 public constant ON_RECVPACKET_ROLE =
        keccak256("ON_RECVPACKET_ROLE");
    bytes32 public constant ON_ACKNOWLEDGEMENT_PACKET_ROLE =
        keccak256("ON_ACKNOWLEDGEMENT_PACKET_ROLE");

    IPacket public packet;
    IERC1155Bank public bank;
    IClientManager public clientManager;
    IAccessManager public accessManager;

    mapping(uint256 => TransferDataTypes.OriginNFT) public traces;

    function initialize(
        address bankContract,
        address packetContract,
        address clientMgrContract,
        address accessManagerContract
    ) public initializer {
        bank = IERC1155Bank(bankContract);
        packet = IPacket(packetContract);
        clientManager = IClientManager(clientMgrContract);
        accessManager = IAccessManager(accessManagerContract);
    }

    /**
     * @notice this function is to send nft and construct data packet
     * @param transferData Send the data needed by nft
     */
    function sendTransfer(TransferDataTypes.TransferData calldata transferData)
        external
        override
    {
        string memory sourceChain = clientManager.getChainName();
        require(
            !sourceChain.equals(transferData.destChain),
            "sourceChain can't equal to destChain"
        );

        bool awayFromOrigin = isAwayFromOrigin(
            transferData.class,
            transferData.destChain
        );

        NftTransfer.Data memory packetData;
        if (awayFromOrigin) {
            // not support
        } else {
            // nft is be closed to origin
            // burn nft
            require(
                _burn(
                    transferData.destContract.parseAddr(),
                    msg.sender,
                    transferData.tokenId,
                    uint256(1)
                ),
                "burn nft failed"
            );

            //delete the binding relationship between origin hft and mint's nft in erc1155
            // and return the origin nft
            TransferDataTypes.OriginNFT memory nft = unbind(
                transferData.tokenId
            );
            packetData = NftTransfer.Data({
                class: nft.class,
                id: nft.id,
                uri: nft.uri,
                sender: Bytes.addressToString(msg.sender),
                receiver: transferData.receiver,
                awayFromOrigin: awayFromOrigin,
                destContract: transferData.destContract
            });
        }
        // send packet
        PacketTypes.Packet memory crossPacket = PacketTypes.Packet({
            sequence: packet.getNextSequenceSend(
                sourceChain,
                transferData.destChain
            ),
            port: PORT,
            sourceChain: sourceChain,
            destChain: transferData.destChain,
            relayChain: transferData.relayChain,
            data: NftTransfer.encode(packetData)
        });
        packet.sendPacket(crossPacket);
    }

    /**
     * @notice this function is to receive packet
     * @param pac Data package containing nft data
     */
    function onRecvPacket(PacketTypes.Packet calldata pac)
        external
        override
        returns (bytes memory acknowledgement)
    {
        require(
        accessManager.hasRole(ON_RECVPACKET_ROLE, address(packet)),
            "the caller does not have permission to process the received packet"
        );
        NftTransfer.Data memory data = NftTransfer.decode(pac.data);
        require(data.destContract.parseAddr() != address(0), "invalid address");
        string memory newClass;
        if (data.awayFromOrigin) {
            Strings.slice memory needle = "/".toSlice();
            Strings.slice memory nftClass = data.class.toSlice();
            if (
                Strings.startsWith(
                    Strings.toSlice(data.class),
                    Strings.toSlice(PREFIX)
                )
            ) {
                // The following operation is to realize the conversion from nft/A/B/nftClass to nft/A/B/C/nftClass
                //   example : nft/wenchang/irishub/kitty -> nft/wenchang/irishub/etherum/kitty
                // The slice.rsplit(needle) method will find the position of the first needle from the right, and then divide the slice into two parts. The slice itself is truncated into the first part (not including needle), and the return value is the second part
                Strings.slice memory originClass = nftClass.rsplit(needle);
                newClass = nftClass
                    .concat(needle)
                    .toSlice()
                    .concat(pac.destChain.toSlice())
                    .toSlice()
                    .concat(needle)
                    .toSlice()
                    .concat(originClass);
            } else {
                // class -> nft/irishub/ethereum/class
                {
                    newClass = PREFIX.toSlice().concat(needle).toSlice().concat(
                            pac.sourceChain.toSlice()
                        );
                }

                {
                    newClass = newClass
                        .toSlice()
                        .concat(needle)
                        .toSlice()
                        .concat(pac.destChain.toSlice());
                }

                {
                    newClass = newClass
                        .toSlice()
                        .concat(needle)
                        .toSlice()
                        .concat(data.class.toSlice());
                }
            }

            // generate tokenId
            uint256 tokenId = genTokenId(newClass, data.id);
            // mint nft
            if (
                _mint(
                    data.destContract.parseAddr(),
                    data.receiver.parseAddr(),
                    tokenId,
                    uint256(1),
                    bytes(data.uri) // send uri to erc1155
                )
            ) {
                // keep trace of class and id and uri
                bind(tokenId, newClass, data.id, data.uri);
                return _newAcknowledgement(true, "");
            }
            return _newAcknowledgement(false, "onrecvPackt : mint nft error");
        }
        // go back to source chain
        // not support
    }

    /**
     * @notice This method is start ack method
     * @param pac Packets transmitted
     * @param acknowledgement ack
     */
    function onAcknowledgementPacket(
        PacketTypes.Packet calldata pac,
        bytes calldata acknowledgement
    ) external override {
        require(
            accessManager.hasRole(ON_ACKNOWLEDGEMENT_PACKET_ROLE, address(packet)),
            "the caller does not have permission to process the ack package"
        );
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(NftTransfer.decode(pac.data));
        }
    }

    /// private functions ///

    /**
     * @notice this function is to destroys `amount` tokens of token type `id` from `account`
     * @param account address of the account to assign the token to
     * @param id token id
     * @param amount amount of tokens to create
     */
    function _burn(
        address destContract,
        address account,
        uint256 id,
        uint256 amount
    ) private returns (bool) {
        try IERC1155Bank(destContract).burn(account, id, amount) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    /**
     * @notice         this function is to create `amount` tokens of token type `id`, and assigns them to `account`.
     * @param account address of the account to assign the token to
     * @param id token id
     * @param amount amount of tokens to create
     * @param data metadata of the nft
     */
    function _mint(
        address destContract,
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private returns (bool) {
        try IERC1155Bank(destContract).mint(account, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    /**
     * @notice this function is to create ack
     * @param success success or not
     */
    function _newAcknowledgement(bool success, string memory errMsg)
        private
        pure
        returns (bytes memory)
    {
        Acknowledgement.Data memory ack;
        if (success) {
            ack.result = hex"01";
        } else {
            ack.error = errMsg;
        }
        return Acknowledgement.encode(ack);
    }

    /**
     * @notice this function is return a successful ack
     * @param acknowledgement ack
     */
    function _isSuccessAcknowledgement(bytes memory acknowledgement)
        private
        pure
        returns (bool)
    {
        Acknowledgement.Data memory ack = Acknowledgement.decode(
            acknowledgement
        );
        return Bytes.equals(ack.result, hex"01");
    }

    /**
     * @notice this function is refund nft
     * @param data Data in the transmitted packet
     */
    function _refundTokens(NftTransfer.Data memory data) private {
        uint256 tokenId = genTokenId(data.class, data.id);
        _mint(
            data.destContract.parseAddr(),
            data.sender.parseAddr(),
            tokenId,
            uint256(1),
            bytes(data.uri)
        );
    }

    /**
     * @notice   determineAwayFromOrigin determine whether nft is sent from the source chain or sent back to the source chain from other chains
     * example :
     *   -- not has prefix
     *   1. A -> B  class:class           | sourceChain:A  | destChain:B |awayFromOrigin = true
     *   -- has prefix
     *   1. B -> C  class:nft/A/B/class   | sourceChain:B  | destChain:C |awayFromOrigin = true   A!=destChain
     *   2. C -> B  class:nft/A/B/C/class | sourceChain:C  | destChain:B |awayFromOrigin = false   B=destChain
     *   3. B -> A  class:nft/A/B/class   | sourceChain:B  | destChain:A |awayFromOrigin = false  A=destChain
     * @param class nft category
     * @param destChain destination chain
     */
    function isAwayFromOrigin(string memory class, string memory destChain)
        private
        pure
        returns (bool)
    {
        if (!Strings.startsWith(class.toSlice(), PREFIX.toSlice())) {
            return true;
        }

        Strings.slice memory delimSlice = "/".toSlice();
        Strings.slice memory classSlice = class.toSlice();
        string memory target;
        for (uint256 i = 0; i < 3; i++) {
            target = classSlice.rsplit(delimSlice).toString();
        }
        return !Strings.equals(target, destChain);
    }

    /**
     * @notice calculate the hash of scNft and id, take the high 128 bits, and concatenate them into new 32-byte data
     * example : tokenId := high128(hash(nft/wenchang/nftclass)) + high128(hash(id))
     * @param newClassStr the class name of the newly generated nft,ex. nft/{originChain}/{....}/nftClass
     * @param originNftId nft id from the original chain
     */
    function genTokenId(string memory newClassStr, string memory originNftId)
        private
        pure
        returns (uint256)
    {
        // calculate sha256
        bytes memory tokenId = Bytes.concat(
            Bytes.cutBytes32(sha256(bytes(newClassStr))),
            Bytes.cutBytes32(sha256(bytes(originNftId)))
        );
        return Bytes.bytes32ToUint(tokenId.toBytes32());
    }

    /**
     * @notice establish a binding relationship between origin nft and mint's nft in erc1155
     *  @param tokenId token Id
     *  @param nftClass class of origin NFT
     *  @param id id of origin NFT
     *  @param _uri uri of origin NFT
     */
    function bind(
        uint256 tokenId,
        string memory nftClass,
        string memory id,
        string memory _uri
    ) private {
        traces[tokenId] = TransferDataTypes.OriginNFT(nftClass, id, _uri);
    }

    /**
     * @notice Delete the binding relationship between origin hft and mint's nft in erc1155
     *  @param tokenId token Id
     */
    function unbind(uint256 tokenId)
        private
        returns (TransferDataTypes.OriginNFT memory nft)
    {
        nft = traces[tokenId];
        delete traces[tokenId];
    }

    function getBinding(uint256 tokenId)
        external
        view
        returns (TransferDataTypes.OriginNFT memory)
    {
        return traces[tokenId];
    }
}
