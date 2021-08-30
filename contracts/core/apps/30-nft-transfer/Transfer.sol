// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../../libraries/30-nft-transfer/NftTransfer.sol";
import "../../../libraries/30-nft-transfer/Bytes.sol";
import "../../../libraries/30-nft-transfer/Strings.sol";
import "../../../libraries/04-packet/Packet.sol";
import "../../../interfaces/IPacket.sol";
import "../../../interfaces/ITransfer.sol";
import "../../04-packet/Packet.sol";

abstract contract Transfer is ITransfer{
    using strings for *;
    using Bytes for *;

    // prefix
    string private constant PREFIX = "tibc/nft";

    // erc1155 contract address
    address erc1155Manager;

    // packet contract address
    address packet;

    // erc1155 contract address
    address erc1155Bank;

    /*
        keep track of class: tokenId -> tibc/nft/wenchang/irishub/nftclass
        keep track of id :   tokenId -> id
        keep track of uri :  tokenId -> uri
    */
    mapping(bytes32 => string) classMapping;
    mapping(bytes32 => string) idMapping;
    mapping(bytes32 => string) uriMapping;

    // events
    event sendTransferEvent(address thisContract , address sender, address receiver);

    function sendTransfer(
        bytes32 tokenId,
        string  calldata receiver,
        string  calldata cls,
        string  calldata destChain,
        string  calldata relayChain
    )override virtual external{
        // sourceChain cannot be equal to destChain
        // todo
        string memory sourceChain = "";
        require(strings.equals(strings.toSlice(sourceChain),strings.toSlice(destChain)), "sourceChain can't equal to destChain");


        // determine whether nft is sent from the source chain or sent back to the source chain from other chains
        bool awayFromOrigin = _determineAwayFromOrigin(cls, destChain);

        // get the next sequence
        // todo
        uint64 sequence = 1;

        uint256 tid = Bytes.bytes32ToUint(tokenId);

        if (awayFromOrigin) {
            // nft is away from origin
            // lock nft (transfer nft to contract address)
            _transferFrom(msg.sender, erc1155Bank, tid, uint256(1), "");
        } else{
            // nft is be closed to origin
            // burn nft
           _burn(msg.sender, tid, uint256(1));
        }

        // data
        // NftTransfer.Data({
        //     class : class,
        //     id : id,
        //     uri : uriMapping[tokenId],
        //     sender: Bytes.addressToString(msg.sender),
        //     receiver: Bytes.addressToString(receiver),
        //     awayFromOrigin : awayFromOrigin
        // })

        // send packet
        // todo  last params need to replace with NftTransfer.data encode
        IPacket(packet).sendPacket(sequence, sourceChain, destChain, relayChain, Bytes.uintToBytes(uint256(1)));
        emit sendTransferEvent(address(this), msg.sender, receiver.parseAddr());
    }

    // Module callbacks
    function onRecvPacket(PacketTypes.Packet calldata pac) external override returns (bytes memory acknowledgement) {
        // NftTransfer.Data memory data = NftTransfer.decode(packet.data);
         NftTransfer.Data memory data; // todo above

        // sourceChain/nftClass
        string memory scNft;
        string memory newClass;
        if (data.awayFromOrigin) {
            if (strings.startsWith(strings.toSlice(data.class), strings.toSlice(PREFIX))){
                // tibc/nft/A/nftClass -> tibc/nft/A/B/nftClass
                string[] memory classSplit = _splitStringIntoArray(data.class, "/");
                string   memory temp = classSplit[classSplit.length-1];
                classSplit[classSplit.length-1] = pac.destChain; //[tibc][nft][A][nftClass] -> [tibc][nft][A][B]
                classSplit[classSplit.length] = temp; //[tibc][nft][A][B] -> [tibc][nft][A][B][nftClass]
                newClass = strings.join(strings.toSlice("/"), _convertStringArrayIntoSliceArray(classSplit));
                // A/nftClass
                scNft = classSplit[2].toSlice().concat("/".toSlice()).toSlice().concat(classSplit[4].toSlice());
            } else{
                // class -> tibc/nft/A/class
                newClass = PREFIX.toSlice().concat("/".toSlice()).toSlice()
                                           .concat(pac.sourceChain.toSlice()).toSlice()
                                           .concat("/".toSlice()).toSlice()
                                           .concat(data.class.toSlice());

                 // A/class
                scNft = pac.sourceChain.toSlice().concat("/".toSlice()).toSlice().concat(data.class.toSlice());
            }

            // generate tokenId
            bytes32 tokenId = _calTokenId(scNft, data.id);

            // mint nft
            _mint(data.receiver.parseAddr(), Bytes.bytes32ToUint(tokenId), uint256(1), "");

            // keep trace of class and id and uri
            setIdMapping(tokenId, data.id);
            setUriMapping(tokenId, data.uri);
            setClassMapping(tokenId, newClass);

            return _newAcknowledgement(true);
        } else{
            // go back to source chain
            require(strings.startsWith(data.class.toSlice(), PREFIX.toSlice()), "class has no prefix");
            string[] memory classSplit = _splitStringIntoArray(data.class, "/");

            if (classSplit.length == 4) {
                // scenes: A_chain receive packet from B_chain
                scNft = classSplit[2].toSlice()
                                     .concat("/".toSlice()).toSlice()
                                     .concat(classSplit[3].toSlice());
                // tibc/nft/A/nftClass -> nftClass
                newClass = classSplit[classSplit.length-1];
            } else {
                // scenes: B_chain receive packet from C_chain
                scNft = classSplit[2].toSlice()
                                     .concat("/".toSlice()).toSlice()
                                     .concat(classSplit[4].toSlice());
                // tibc/nft/A/B/nftClass -> tibc/nft/A/nftClass
                classSplit[classSplit.length - 2] = classSplit[classSplit.length - 2];
                delete classSplit[classSplit.length - 1];
                newClass = strings.join("/".toSlice(), _convertStringArrayIntoSliceArray(classSplit));
            }

            // generate tokenId
            bytes32 tokenId = _calTokenId(scNft, data.id);

            // unlock
            return _newAcknowledgement(
                _transferFrom(erc1155Bank, data.receiver.parseAddr(), Bytes.bytes32ToUint(tokenId), uint256(1), "")
            );
        }

    }


    function onAcknowledgementPacket(PacketTypes.Packet calldata pac, bytes calldata acknowledgement) external override {
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(NftTransfer.decode(pac.data), pac.sourceChain);
        }
    }


    /// Internal functions ///
    function _burn(address account,uint256 id,uint256 amount) internal virtual returns(bool);

    function _mint(address account,uint256 id,uint256 amount,bytes memory data) internal virtual returns(bool);

    function _transferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) internal virtual returns(bool);

    function _newAcknowledgement(bool success) internal virtual pure returns (bytes memory) {
        bytes memory acknowledgement = new bytes(1);
        if (success) {
            acknowledgement[0] = 0x01;
        } else {
            acknowledgement[0] = 0x00;
        }
        return acknowledgement;
    }

    function _isSuccessAcknowledgement(bytes memory acknowledgement) internal virtual pure returns (bool) {
        require(acknowledgement.length == 1, "acknowledgement length must equals 1");
        return acknowledgement[0] == 0x01;
    }

    function _refundTokens(NftTransfer.Data memory data, string memory sourceChain) internal virtual {
        string[] memory classSplit = _splitStringIntoArray(data.class, "/");
        string memory scNft;
        if (strings.startsWith(strings.toSlice(data.class), strings.toSlice(PREFIX))){
            if (classSplit.length == 5) {
            // tibc/nft//A/B/nftClass
            scNft = classSplit[2].toSlice()
                                 .concat("/".toSlice()).toSlice()
                                 .concat(classSplit[4].toSlice());
             }
        } else{
            // class
            scNft = sourceChain.toSlice()
                               .concat("/".toSlice()).toSlice()
                               .concat(data.class.toSlice());
        }

        // generate tokenId
        bytes32 tokenId = _calTokenId(scNft, data.id);

        if (data.awayFromOrigin) {
            // unlock
            _transferFrom(erc1155Bank, msg.sender, Bytes.bytes32ToUint(tokenId), uint256(1), "");
        } else{
            // tibc/nft/A/B/nftClass
            // mint nft
            _mint(msg.sender, Bytes.bytes32ToUint(tokenId), uint256(1), "");
        }
    }

    /// helper functions ///

    // determineAwayFromOrigin determine whether nft is sent from the source chain or sent back to the source chain from other chains
    function _determineAwayFromOrigin(string calldata class, string calldata destChain) internal pure returns (bool){
        /*
            -- not has prefix
            1. A -> B  class:class | sourceChain:A  | destChain:B |awayFromOrigin = true
            -- has prefix
            1. B -> C    class:tibc/nft/A/class   | sourceChain:B  | destChain:C |awayFromOrigin = true   A!=destChain
            2. C -> B    class:tibc/nft/A/B/class | sourceChain:C  | destChain:B |awayFromOrigin = false  B=destChain
            3. B -> A    class:tibc/nft/A/class   | sourceChain:B  | destChain:A |awayFromOrigin = false  A=destChain
        */

        if (!strings.startsWith(class.toSlice(), PREFIX.toSlice())){
            return true;
        }

        string[] memory classSplit = _splitStringIntoArray(class, "/");
        return !strings.equals(classSplit[classSplit.length-2].toSlice(), destChain.toSlice());
    }

    // split string into Array
    // "tibc/nft/A" -> [tibc][nft][A]
    function _splitStringIntoArray(string memory newClass, string memory delim)internal pure returns (string[] memory){
        string[]memory parts = new string[](newClass.toSlice().count(delim.toSlice()) + 1);
        for(uint i = 0; i < parts.length; i++) {
            parts[i] = newClass.toSlice().split(delim.toSlice()).toString();
        }
        return parts;
    }

    // convert stringArray into sliceArray
    function _convertStringArrayIntoSliceArray(string[] memory src) internal pure returns(strings.slice[] memory){
        strings.slice[] memory res = new strings.slice[](src.length);
        for(uint i = 0; i < src.length; i++) {
            res[i] = src[i].toSlice();
        }
        return res;
    }

    // calculate  tokenId
    // tokenId := high128(hash(wenchang/nftclass)) + high128(hash(id))
    function _calTokenId(string memory scNft, string memory id) internal pure returns(bytes32){
        // calculate sha256
        bytes memory   c1 = Bytes.cutBytes32(sha256(bytes(scNft)));
        bytes memory   c2 = Bytes.cutBytes32(sha256(bytes(id)));
        bytes memory   tokenId = Bytes.concat(c1, c2);
        return string(tokenId).stringToBytes32();
    }

    function setClassMapping(bytes32 tokenId, string memory class)internal{
        classMapping[tokenId] = class;
    }

    function getClassMapping(bytes32 tokenId)internal view returns (string storage){
        return classMapping[tokenId];
    }

    function setIdMapping(bytes32 tokenId, string memory id)internal{
        classMapping[tokenId] = id;
    }

    function getIdMapping(bytes32 tokenId)internal view returns (string storage){
        return idMapping[tokenId];
    }


    function setUriMapping(bytes32 tokenId, string memory uri)internal{
        classMapping[tokenId] = uri;
    }

    function getUriMapping(bytes32 tokenId)internal view returns (string storage){
        return uriMapping[tokenId];
    }

}
