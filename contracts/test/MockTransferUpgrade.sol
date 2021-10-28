// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../proto/NftTransfer.sol";
import "../proto/Ack.sol";
import "../core/02-client/ClientManager.sol";
import "../libraries/04-packet/Packet.sol";
import "../libraries/30-nft-transfer/NftTransfer.sol";
import "../libraries/utils/Bytes.sol";
import "../libraries/utils/Strings.sol";
import "../interfaces/IPacket.sol";
import "../interfaces/ITransfer.sol";
import "../interfaces/IERC1155Bank.sol";
import "../interfaces/IAccessManager.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "hardhat/console.sol";

contract MockTransferUpgrade is Initializable, ITransfer, ERC1155HolderUpgradeable {
    using Strings for *;
    using Bytes for *;

    string private constant PORT = "NFT";
    string private constant PREFIX = "nft";

    IPacket public packet;
    IERC1155Bank public bank;
    IClientManager public clientManager;

    mapping(uint256 => TransferDataTypes.OriginNFT) public traces;
    
    uint256 public version;

    /**
     * @notice Event triggered when the nft mint
     * @param srcTokenId the token id of the nft transferred in the cross-chain
     * @param tokenId newly generated token id
     * @param uri uri of nft
     */
    event Mint(string srcTokenId, uint256 tokenId, string uri);
    /**
     * @notice Event triggered when the nft burn
     * @param srcTokenId the token id of the nft transferred in the cross-chain
     * @param tokenId newly generated token id
     * @param uri uri of nft
     */
    event Burn(string srcTokenId, uint256 tokenId, string uri);

    // check if caller is clientManager
    modifier onlyPacket() {
        require(msg.sender == address(packet), "caller not packet contract");
        _;
    }

    function setVersion(uint256 _version) public {
        version = _version;
    }

    function initialize(
        address bankContract,
        address packetContract,
        address clientMgrContract
    ) public initializer {
        bank = IERC1155Bank(bankContract);
        packet = IPacket(packetContract);
        clientManager = IClientManager(clientMgrContract);
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
            emit Burn(nft.id, transferData.tokenId, nft.uri);
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
     * @param pac Data package containing nft data onlyAuthorizee(ON_RECVPACKET_ROLE, address(packet))
     */
    function onRecvPacket(PacketTypes.Packet calldata pac)
        external
        override
        returns (bytes memory)
    {
       bind(uint256(1), "nft/irishub/dog", "taidy", "www.test.com");
       return bytes("hello");
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
