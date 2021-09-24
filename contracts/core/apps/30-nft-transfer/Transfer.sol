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
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract Transfer is Initializable, ITransfer, ERC1155HolderUpgradeable {
    using Strings for *;
    using Bytes for *;
    using Strings for *;
    
    string private constant PORT = "NFT";
    string private constant PREFIX = "tibc/nft";

    IPacket public packet;
    IERC1155Bank public bank;
    IClientManager public clientManager;

    function initialize(
        address bank_,
        address packet_,
        address clientManager_
    ) public initializer {
        bank = IERC1155Bank(bank_);
        packet = IPacket(packet_);
        clientManager = IClientManager(clientManager_);
    }

    /*  @notice                 this function is to send nft and construct data packet
     *
     *  @param transferData     send the data needed by nft
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

    // Module callbacks
    /*  @notice                 this function is to receive packet
     *
     *  @param pac              Data package containing nft data
     */
    function onRecvPacket(PacketTypes.Packet calldata pac)
        external
        override
        returns (bytes memory acknowledgement)
    {
        NftTransfer.Data memory data = NftTransfer.decode(pac.data);

        string memory scNft; // sourceChain/nftClass
        string memory newClass;
        string memory errMsg;
        bool success;

        if (data.awayFromOrigin) {
            if (
                Strings.startsWith(
                    Strings.toSlice(data.class),
                    Strings.toSlice(PREFIX)
                )
            ) {
                // tibc/nft/A/nftClass -> tibc/nft/A/B/nftClass
                // tibc/nft/A/nftClass -> [tibc][nft][A][nftClass]
                string[] memory classSplit = _splitStringIntoArray(
                    data.class,
                    "/"
                );
                string memory temp = classSplit[classSplit.length - 1];

                // [tibc][nft][A][nftClass] -> [tibc][nft][A][B]
                classSplit[classSplit.length - 1] = pac.sourceChain;

                // [tibc][nft][A][B] -> "tibc/nft/A/B"
                newClass = Strings.join(
                    Strings.toSlice("/"),
                    _convertStringArrayIntoSliceArray(classSplit)
                );

                // "tibc/nft/A/B" -> "tibc/nft/A/B/nftClass"
                newClass = newClass
                    .toSlice()
                    .concat("/".toSlice())
                    .toSlice()
                    .concat(temp.toSlice());

                scNft = _getSCNft(data.class);
            } else {
                // class -> tibc/nft/A/class
                newClass = PREFIX
                    .toSlice()
                    .concat("/".toSlice())
                    .toSlice()
                    .concat(pac.sourceChain.toSlice())
                    .toSlice()
                    .concat("/".toSlice())
                    .toSlice()
                    .concat(data.class.toSlice());

                // A/class
                scNft = pac
                    .sourceChain
                    .toSlice()
                    .concat("/".toSlice())
                    .toSlice()
                    .concat(data.class.toSlice());
            }

            // generate tokenId
            uint256 tokenId = Bytes.bytes32ToUint(_calTokenId(scNft, data.id));

            // mint nft
            success = _mint(data.receiver.parseAddr(), tokenId, uint256(1), "");

            if (success) {
                // keep trace of class and id and uri
                bank.setMapValue(tokenId, newClass, data.id, data.uri);
            } else {
                errMsg = "onrecvPackt : mint nft error";
            }
            
            return _newAcknowledgement(success, errMsg);
        } else {
            // go back to source chain
            require(
                Strings.startsWith(data.class.toSlice(), PREFIX.toSlice()),
                "class has no prefix"
            );
            string[] memory classSplit = _splitStringIntoArray(data.class, "/");

            if (classSplit.length == 4) {
                // scenes: A_chain receive packet from B_chain
                scNft = _getSCNft(data.class);

                // tibc/nft/A/nftClass -> nftClass
                newClass = classSplit[classSplit.length - 1];
            } else {
                // scenes: B_chain receive packet from C_chain
                scNft = _getSCNft(data.class);

                // [tibc][nft][A][B][nftClass] -> [tibc][nft][A][nftClass]
                newClass = classSplit[0]
                    .toSlice()
                    .concat(classSplit[1].toSlice())
                    .toSlice()
                    .concat(classSplit[2].toSlice())
                    .toSlice()
                    .concat(classSplit[classSplit.length - 1].toSlice());

                newClass = Strings.join(
                    "/".toSlice(),
                    _convertStringArrayIntoSliceArray(classSplit)
                );
            }

            // generate tokenId
            uint256 tokenId = Bytes.bytes32ToUint(_calTokenId(scNft, data.id));

            // unlock
            success = _transferFrom(
                address(bank),
                data.receiver.parseAddr(),
                tokenId,
                uint256(1),
                bytes("")
            );

            if (!success) {
                errMsg = "onrecvPackt : unlock nft error";
            }
            return _newAcknowledgement(success, errMsg);
        }
    }

    /* @notice                  This method is start ack method
     * @param pac               Packets transmitted
     * @param acknowledgement    ack
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

    /*  @notice        this function is to destroys `amount` tokens of token type `id` from `account`
     *
     *  @param account
     *  @param id
     *  @param amount
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

    /*  @notice         this function is to create `amount` tokens of token type `id`, and assigns them to `account`.
     *
     *  @param account
     *  @param id
     *  @param amount
     *  @param data
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

    /*  @notice        this function is to transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     *  @param from
     *  @param to
     *  @param amount
     *  @param data
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

    /* @notice   This method is to obtain the splicing of the source chain and nftclass from the cross-chain nft prefix
     * The realization is aimed at the following two situations
     * 1. tibc/nft/A/nftClass   -> A/nftClass
     * 2. tibc/nft/A/B/nftClass -> A/nftClass
     * @param class    classification of cross-chain nft assets
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

    /*  @notice                 this function is to create ack
     *
     *  @param success          identify whether ack succeeded or failed
     *  @param errMsg           ack error message
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

    /*  @notice                 this function is return a successful ack
     *
     *  @param acknowledgement
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

    /*  @notice                 this function is refund nft
     *
     *  @param data             Data in the transmitted packet
     *  @param sourceChain      The chain that executes this method
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
        uint256 tokenId = Bytes.bytes32ToUint(_calTokenId(scNft, data.id));
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

    /* @notice   determineAwayFromOrigin determine whether nft is sent from the source chain or sent back to the source chain from other chains
     * example : 
        -- not has prefix
        1. A -> B  class:class | sourceChain:A  | destChain:B |awayFromOrigin = true
        -- has prefix
        1. B -> C    class:tibc/nft/A/class   | sourceChain:B  | destChain:C |awayFromOrigin = true   A!=destChain
        2. C -> B    class:tibc/nft/A/B/class | sourceChain:C  | destChain:B |awayFromOrigin = false  B=destChain
        3. B -> A    class:tibc/nft/A/class   | sourceChain:B  | destChain:A |awayFromOrigin = false  A=destChain
     * @param class   
     * @param destChain  
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

    /* @notice   This method is to split string into string array
     * example : "tibc/nft/A" -> [tibc][nft][A]
     * @param newClass   string to be split
     * @param delim      delim
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

    /* @notice   This method is to convert stringArray into sliceArray
     * @param    src
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

    /* @notice   calculate the hash of scNft and id, take the high 128 bits, and concatenate them into new 32-byte data
     * example : tokenId := high128(hash(wenchang/nftclass)) + high128(hash(id))
     * @param    scNft   souceChain/nftClass
     * @param    id      Nft id from other blockchain systems
     */
    function _calTokenId(string memory scNft, string memory id)
        internal
        pure
        returns (bytes32)
    {
        // calculate sha256
        bytes memory c1 = Bytes.cutBytes32(sha256(bytes(scNft)));
        bytes memory c2 = Bytes.cutBytes32(sha256(bytes(id)));
        bytes memory tokenId = Bytes.concat(c1, c2);
        return tokenId.toBytes32();
    }
}
