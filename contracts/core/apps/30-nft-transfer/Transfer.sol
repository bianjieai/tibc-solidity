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
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract Transfer is Initializable, ITransfer, ERC1155HolderUpgradeable {
    using Strings for *;
    using Bytes for *;

    string private constant PORT = "NFT";
    string private constant PREFIX = "nft";

    IPacket public packet;
    IERC1155Bank public bank;
    IClientManager public clientManager;

    // check if caller is clientManager
    modifier onlyPacketContract() {
        require(msg.sender == address(packet), "caller not packet contract");
        _;
    }

    function initialize(
        address bankContract,
        address packetContract,
        address clientMgrContract
    ) public initializer {
        bank = IERC1155Bank(bankContract);
        packet = IPacket(packetContract);
        clientManager = IClientManager(clientMgrContract);

        bank.setOwner(address(this));
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
                _burn(msg.sender, transferData.tokenId, uint256(1)),
                "burn nft failed"
            );

            //delete the binding relationship between origin hft and mint's nft in erc1155
            // and return the origin nft
            IERC1155Bank.OriginNFT memory nft = bank.untrace(
                transferData.tokenId
            );
            packetData = NftTransfer.Data({
                class: nft.class,
                id: nft.id,
                uri: nft.uri,
                sender: Bytes.addressToString(msg.sender),
                receiver: transferData.receiver,
                awayFromOrigin: awayFromOrigin
            });
        }
        bytes memory data = NftTransfer.encode(packetData);
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
            data: data
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
        onlyPacketContract
        returns (bytes memory acknowledgement)
    {
        NftTransfer.Data memory data = NftTransfer.decode(pac.data);
        string memory newClass;
        if (data.awayFromOrigin) {
            // nft/A/B/nftClass -> [nft][A][B][nftClass]
            string[] memory paths = _splitStringIntoArray(data.class, "/");
            // get the original class name (take the last item in the path array)
            string memory originClass = paths[paths.length - 1];
            // [nft][A][B][nftClass] -> [nft][A][B][C]
            paths[paths.length - 1] = pac.destChain;
            // [nft][A][B][C] -> nft/A/B/C/nftClass
            newClass = Strings
                .join(
                    Strings.toSlice("/"),
                    _convertStringArrayIntoSliceArray(paths)
                )
                .toSlice()
                .concat("/".toSlice())
                .toSlice()
                .concat(originClass.toSlice());
            // generate tokenId
            uint256 tokenId = genTokenId(newClass, data.id);

            // mint nft
            if (_mint(data.receiver.parseAddr(), tokenId, uint256(1), "")) {
                // keep trace of class and id and uri
                bank.trace(tokenId, newClass, data.id, data.uri);
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
    ) external override onlyPacketContract {
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
        address account,
        uint256 id,
        uint256 amount
    ) private returns (bool) {
        try bank.burn(account, id, amount) {
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
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private returns (bool) {
        try bank.mint(account, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    /**
     * @notice this function is to transfers `amount` tokens of token type `id` from `from` to `to`.
     * @param from the address of the sender
     * @param to the address of the receiver
     * @param amount the amount of tokens to be transferred
     * @param data the data to be stored in the token
     */
    function _transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) private returns (bool) {
        try bank.transferFrom(from, to, id, amount, data) {
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
        _mint(data.sender.parseAddr(), tokenId, uint256(1), bytes(""));
    }

    /**
     * TODO
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
        string[] memory paths = _splitStringIntoArray(class, "/");
        return !Strings.equals(paths[paths.length - 3], destChain);
    }

    /**
     * @notice   This method is to split string into string array
     * example : "tibc/nft/A" -> [tibc][nft][A]
     * @param newClass string to be split
     * @param delim delim
     */
    function _splitStringIntoArray(string memory newClass, string memory delim)
        private
        pure
        returns (string[] memory)
    {
        Strings.slice memory newClassSlice = newClass.toSlice();
        Strings.slice memory delimSlice = delim.toSlice();
        string[] memory parts = new string[](
            newClassSlice.count(delimSlice) + 1
        );
        for (uint256 i = 0; i < parts.length; i++) {
            parts[i] = newClassSlice.split(delimSlice).toString();
        }
        return parts;
    }

    /**
     * @notice This method is to convert stringArray into sliceArray
     * @param src string array
     */
    function _convertStringArrayIntoSliceArray(string[] memory src)
        private
        pure
        returns (Strings.slice[] memory)
    {
        Strings.slice[] memory res = new Strings.slice[](src.length);
        for (uint256 i = 0; i < src.length; i++) {
            res[i] = src[i].toSlice();
        }
        return res;
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
        bytes memory c1 = Bytes.cutBytes32(sha256(bytes(newClassStr)));
        bytes memory c2 = Bytes.cutBytes32(sha256(bytes(originNftId)));
        bytes memory tokenId = Bytes.concat(c1, c2);
        return Bytes.bytes32ToUint(tokenId.toBytes32());
    }
}
