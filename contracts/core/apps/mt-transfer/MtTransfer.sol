// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../../proto/MtTransfer.sol";
import "../../../proto/Ack.sol";
import "../../02-client/ClientManager.sol";
import "../../../libraries/04-packet/Packet.sol";
import "../../../libraries/mt-transfer/MtTransfer.sol";
import "../../../libraries/utils/Bytes.sol";
import "../../../libraries/utils/Strings.sol";
import "../../../interfaces/IPacket.sol";
import "../../../interfaces/IMtTransfer.sol";
import "../../../interfaces/IERC1155Bank.sol";
import "../../../interfaces/IAccessManager.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MultiTokenTransfer is Initializable, IMtTransfer, OwnableUpgradeable {
    using Strings for *;
    using Bytes for *;

    string private constant PORT = "MT";
    string private constant PREFIX = "mt";

    IPacket public packet;
    IClientManager public clientManager;

    mapping(uint256 => TransferDataTypes.OriginMT) public traces;

    /**
     * @notice Event triggered when the mt mint
     * @param srcMtId the token id of the mt transferred in the cross-chain
     * @param mtId newly generated token id
     * @param data data of mt
     * @param amount amount of mt
     */
    event Mint(string srcMtId, uint256 mtId, bytes data, uint256 amount);
    /**
     * @notice Event triggered when the mt burn
     * @param srcMtId the token id of the mt transferred in the cross-chain
     * @param mtId newly generated token id
     * @param data data of mt
     * @param amount amount of mt
     */
    event Burn(string srcMtId, uint256 mtId, bytes data, uint256 amount);

    // check if caller is clientManager
    modifier onlyPacket() {
        require(msg.sender == address(packet), "caller not packet contract");
        _;
    }

    function initialize(address packetContract, address clientMgrContract)
        public
        initializer
    {
        packet = IPacket(packetContract);
        clientManager = IClientManager(clientMgrContract);
    }

    /**
     * @notice this function is to send nft and construct data packet
     * @param transferData Send the data needed by mt
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

        require(
            transferData.amount > 0,
            "amount of mt must be greater than 0"
        );

        bool awayFromOrigin = isAwayFromOrigin(
            transferData.class,
            transferData.destChain
        );

        MtTransfer.Data memory packetData;
        if (awayFromOrigin) {
            //todo
        } else {
            // mt is be closed to origin
            // burn mt
            require(
                _burn(
                    transferData.destContract.parseAddr(),
                    msg.sender,
                    transferData.tokenId,
                    transferData.amount
                ),
                "burn mt failed"
            );

            TransferDataTypes.OriginMT memory mt = traces[transferData.tokenId];
            packetData = MtTransfer.Data({
                class: mt.class,
                id: mt.id,
                data: mt.data,
                sender: Bytes.addressToString(msg.sender),
                receiver: transferData.receiver,
                awayFromOrigin: awayFromOrigin,
                destContract: transferData.destContract,
                amount: transferData.amount
            });
            emit Burn(mt.id, transferData.tokenId, mt.data,transferData.amount);
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
            data: MtTransfer.encode(packetData)
        });
        packet.sendPacket(crossPacket);
    }

    /**
     * @notice this function is to receive packet
     * @param pac Data package containing mt data onlyAuthorizee(ON_RECVPACKET_ROLE, address(packet))
     */
    function onRecvPacket(PacketTypes.Packet calldata pac)
        external
        override
        onlyPacket
        returns (bytes memory)
    {
        MtTransfer.Data memory data = MtTransfer.decode(pac.data);
        require(
            bytes(data.destContract).length > 0,
            "transfer: invalid destContract"
        );
        require(
            data.destContract.parseAddr() != address(0),
            "transfer: invalid address"
        );
        require(
            data.amount > 0,
            "amount of mt must be greater than 0"
        );
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
                // The following operation is to realize the conversion from mt/A/B/mtClass to mt/A/B/C/mtClass
                //   example : mt/wenchang/irishub/kitty -> mt/wenchang/irishub/etherum/kitty
                // The slice.rsplit(needle) method will find the position of the first needle from the right, and then divide the slice into two parts. The slice itself is truncated into the first part (not including needle), and the return value is the second part

                Strings.slice memory originClass = nftClass.rsplit(needle);

                {
                    newClass = nftClass.concat(needle);
                }
                {
                    newClass = newClass.toSlice().concat(
                        pac.destChain.toSlice()
                    );
                }
                {
                    newClass = newClass
                        .toSlice()
                        .concat(needle)
                        .toSlice()
                        .concat(originClass);
                }
            } else {
                // class -> mt/irishub/ethereum/class
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
            // mint mt
            if (
                _mint(
                    data.destContract.parseAddr(),
                    data.receiver.parseAddr(),
                    tokenId,
                    data.amount,
                    data.data // send uri to erc1155
                )
            ) {
                // keep trace of class and id and uri
                bind(tokenId, newClass, data.id, data.data);
                emit Mint(data.id, tokenId, data.data,data.amount);
                return _newAcknowledgement(true, "");
            }
            return _newAcknowledgement(false, "onrecvPackt : mint mt error");
        }
        // go back to source chain
        // todo
    }

    /**
     * @notice This method is start ack method
     * @param pac Packets transmitted
     * @param acknowledgement ack
     */
    function onAcknowledgementPacket(
        PacketTypes.Packet calldata pac,
        bytes calldata acknowledgement
    ) external override onlyPacket {
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(MtTransfer.decode(pac.data));
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
     * @notice this function is refund mt
     * @param data Data in the transmitted packet
     */
    function _refundTokens(MtTransfer.Data memory data) private {
        uint256 tokenId = genTokenId(data.class, data.id);
        _mint(
            data.destContract.parseAddr(),
            data.sender.parseAddr(),
            tokenId,
            data.amount,
            data.data
        );
    }

    /**
     * @notice   determineAwayFromOrigin determine whether mt is sent from the source chain or sent back to the source chain from other chains
     * example :
     *   -- not has prefix
     *   1. A -> B  class:class           | sourceChain:A  | destChain:B |awayFromOrigin = true
     *   -- has prefix
     *   1. B -> C  class:mt/A/B/class   | sourceChain:B  | destChain:C |awayFromOrigin = true   A!=destChain
     *   2. C -> B  class:mt/A/B/C/class | sourceChain:C  | destChain:B |awayFromOrigin = false   B=destChain
     *   3. B -> A  class:mt/A/B/class   | sourceChain:B  | destChain:A |awayFromOrigin = false  A=destChain
     * @param class mt category
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
     * @notice calculate the hash of scMt and id, take the high 128 bits, and concatenate them into new 32-byte data
     * example : tokenId := high128(hash(mt/wenchang/nftclass)) + high128(hash(id))
     * @param newClassStr the class name of the newly generated nft,ex. nft/{originChain}/{....}/mtClass
     * @param originMtId nft id from the original chain
     */
    function genTokenId(string memory newClassStr, string memory originMtId)
        private
        pure
        returns (uint256)
    {
        // calculate sha256
        bytes memory tokenId = Bytes.concat(
            Bytes.cutBytes32(sha256(bytes(newClassStr))),
            Bytes.cutBytes32(sha256(bytes(originMtId)))
        );
        return Bytes.bytes32ToUint(tokenId.toBytes32());
    }

    /**
     * @notice establish a binding relationship between origin nft and mint's nft in erc1155
     *  @param tokenId token Id
     *  @param mtClass class of origin MT
     *  @param id id of origin MT
     *  @param data uri of origin MT
     */
    function bind(
        uint256 tokenId,
        string memory mtClass,
        string memory id,
        bytes memory data
    ) private {
        traces[tokenId] = TransferDataTypes.OriginMT(mtClass, id, data);
    }

    /**
     * @notice Delete the binding relationship between origin mt and mint's mt in erc1155
     *  @param tokenId token Id
     */
    function unbind(uint256 tokenId)
        private
        returns (TransferDataTypes.OriginMT memory mt)
    {
        mt = traces[tokenId];
        delete traces[tokenId];
    }

    function getBinding(uint256 tokenId)
        external
        view
        returns (TransferDataTypes.OriginMT memory)
    {
        return traces[tokenId];
    }
}
