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
import "./ERC1155Bank.sol";
import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";

contract Transfer is ITransfer, ERC1155Holder {
    using Bytes for *;
    using Strings for *;

    string private constant PORT = "NFT";
    string private constant PREFIX = "nft";

    IPacket public packet;
    IERC1155Bank public bank;
    IClientManager public clientManager;

    constructor(
        address bankContract,
        address packetContract,
        address clientMgrContract
    ) public {
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
        virtual
        override
    {
        string memory sourceChain = clientManager.getChainName();
        require(
            !sourceChain.equals(transferData.destChain),
            "sourceChain can't equal to destChain"
        );

        bool awayFromOrigin = _determineAwayFromOrigin(
            transferData.class,
            transferData.destChain
        );

        if (awayFromOrigin) {
            // nft is away from origin
            // lock nft (transfer nft to nft-transfer contract address)
            require(
                _transferFrom(
                    msg.sender,
                    address(this),
                    transferData.tokenId,
                    uint256(1),
                    bytes("")
                )
            );
        } else {
            // nft is be closed to origin
            // burn nft
            require(_burn(msg.sender, transferData.tokenId, uint256(1)));
        }

        // NftMapValue memory mapData = getMapValue(transferData.tokenId);

        bytes memory data = NftTransfer.encode(
            NftTransfer.Data({
                class: bank.getClass(transferData.tokenId),
                id: bank.getId(transferData.tokenId),
                uri: bank.getUri(transferData.tokenId),
                sender: Bytes.addressToString(msg.sender),
                receiver: transferData.receiver,
                awayFromOrigin: awayFromOrigin
            })
        );

        // send packet
        PacketTypes.Packet memory pac = PacketTypes.Packet({
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
        packet.sendPacket(pac);
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
                .concat(originClass.toSlice());

            // generate tokenId
            uint256 tokenId = genTokenId(newClass, data.id);

            // mint nft
            if (_mint(data.receiver.parseAddr(), tokenId, uint256(1), "")) {
                // keep trace of class and id and uri
                bank.setMapValue(tokenId, newClass, data.id, data.uri);
                return _newAcknowledgement(true, "");
            }
            return _newAcknowledgement(false, "onrecvPackt : mint nft error");
        }

        // go back to source chain
        require(
            Strings.startsWith(data.class.toSlice(), PREFIX.toSlice()),
            "class has no prefix"
        );
        string[] memory paths = _splitStringIntoArray(data.class, "/");
        // go back to original chain
        if (paths.length == 4) {
            // TODO
            // success = _transferFrom(
            //     address(bank),
            //     data.receiver.parseAddr(),
            //     data.id,
            //     uint256(1),
            //     bytes("")
            // );
            // return;
        }
        // /nft/A/B/C/nftClass -> nft/A/B/nftClass
        paths[paths.length - 2] = paths[paths.length - 1];
        paths[paths.length - 1] = "";
        newClass = Strings.join(
            Strings.toSlice("/"),
            _convertStringArrayIntoSliceArray(paths)
        );
        // generate tokenId
        uint256 tokenId = genTokenId(newClass, data.id);
        // unlock
        if (
            _transferFrom(
                address(bank),
                data.receiver.parseAddr(),
                tokenId,
                uint256(1),
                bytes("")
            )
        ) {
            return _newAcknowledgement(true, "");
        }
        return _newAcknowledgement(false, "onrecvPackt : unlock nft error");
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
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(NftTransfer.decode(pac.data), pac.sourceChain);
        }
    }

    /// Internal functions ///

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
    ) internal virtual returns (bool) {
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
    ) internal virtual returns (bool) {
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
    ) internal virtual returns (bool) {
        try bank.transferFrom(from, to, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    /**
     * @notice This method is to obtain the splicing of the source chain and nftclass from the cross-chain nft prefix
     * The realization is aimed at the following two situations
     * 1. tibc/nft/A/nftClass   -> A/nftClass
     * 2. tibc/nft/A/B/nftClass -> A/nftClass
     * @param class classification of cross-chain nft assets
     */
    function _getSCNft(string memory class)
        internal
        pure
        returns (string memory)
    {
        string[] memory classSplit = _splitStringIntoArray(class, "/");
        return
            classSplit[2].toSlice().concat("/".toSlice()).toSlice().concat(
                classSplit[classSplit.length - 1].toSlice()
            );
    }

    /**
     * @notice this function is to create ack
     * @param success success or not
     */
    function _newAcknowledgement(bool success, string memory errMsg)
        internal
        pure
        virtual
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

    /*  @notice                 this function is to decode ack
     *
     *  @param ack              ack after protobuf encoding
     */
    function _decodeAcknowledgement(bytes memory ack)
        internal
        pure
        virtual
        returns (Acknowledgement.Data memory)
    {
        return Acknowledgement.decode(ack);
    }

    /**
     * @notice this function is return a successful ack
     * @param acknowledgement ack
     */
    function _isSuccessAcknowledgement(bytes memory acknowledgement)
        internal
        pure
        virtual
        returns (bool)
    {
        Acknowledgement.Data memory ack = _decodeAcknowledgement(
            acknowledgement
        );

        return Bytes.equals(ack.result, hex"01");
    }

    /**
     * @notice this function is refund nft
     * @param data Data in the transmitted packet
     * @param sourceChain The chain that executes this method
     */
    function _refundTokens(
        NftTransfer.Data memory data,
        string memory sourceChain
    ) internal virtual {
        string[] memory classSplit = _splitStringIntoArray(data.class, "/");
        string memory scNft;
        if (
            Strings.startsWith(
                Strings.toSlice(data.class),
                Strings.toSlice(PREFIX)
            )
        ) {
            if (classSplit.length == 5) {
                // tibc/nft//A/B/nftClass
                scNft = classSplit[2]
                    .toSlice()
                    .concat("/".toSlice())
                    .toSlice()
                    .concat(classSplit[4].toSlice());
            }
        } else {
            // class
            scNft = sourceChain
                .toSlice()
                .concat("/".toSlice())
                .toSlice()
                .concat(data.class.toSlice());
        }
        // generate tokenId
        uint256 tokenId = genTokenId(scNft, data.id);
        if (data.awayFromOrigin) {
            // unlock
            _transferFrom(
                address(this),
                data.sender.parseAddr(),
                tokenId,
                uint256(1),
                bytes("")
            );
        } else {
            // tibc/nft/A/B/nftClass
            // mint nft
            _mint(data.sender.parseAddr(), tokenId, uint256(1), bytes(""));
        }
    }

    /**
     * @notice   determineAwayFromOrigin determine whether nft is sent from the source chain or sent back to the source chain from other chains
     * example :
     *   -- not has prefix
     *   1. A -> B  class:class | sourceChain:A  | destChain:B |awayFromOrigin = true
     *   -- has prefix
     *   1. B -> C  class:tibc/nft/A/class   | sourceChain:B  | destChain:C |awayFromOrigin = true   A!=destChain
     *  2. C -> B   class:tibc/nft/A/B/class | sourceChain:C  | destChain:B |awayFromOrigin = false   B=destChain
     *   3. B -> A  class:tibc/nft/A/class   | sourceChain:B  | destChain:A |awayFromOrigin = false  A=destChain
     * @param class nft category
     * @param destChain destination chain
     */
    function _determineAwayFromOrigin(
        string memory class,
        string memory destChain
    ) internal pure returns (bool) {
        if (!Strings.startsWith(class.toSlice(), PREFIX.toSlice())) {
            return true;
        }

        string[] memory classSplit = _splitStringIntoArray(class, "/");
        return !Strings.equals(classSplit[classSplit.length - 2], destChain);
    }

    /**
     * @notice   This method is to split string into string array
     * example : "tibc/nft/A" -> [tibc][nft][A]
     * @param newClass string to be split
     * @param delim delim
     */
    function _splitStringIntoArray(string memory newClass, string memory delim)
        internal
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
        internal
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
        internal
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
