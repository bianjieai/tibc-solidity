// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../../proto/NftTransfer.sol";
import "../uu/Bytes.sol";
import "../uu/Strings.sol";
import "../../../libraries/04-packet/Packet.sol";
import "../../../interfaces/IPacket.sol";
import "../../../interfaces/ITransfer.sol";
import "../../04-packet/Packet.sol";
import "./ERC1155Bank.sol";
import "hardhat/console.sol";

contract Transfer is ITransfer{
    using strings for *;
    using Bytes for *;

    // prefix
    string private constant PREFIX = "tibc/nft";


    // referenced contract
    ERC1155Bank bank;
    Packet packet;
    

    constructor(ERC1155Bank bank_, Packet packet_) public{
        bank = bank_;
        packet = packet_;
    }

    /*
        keep track of class: tokenId -> tibc/nft/wenchang/irishub/nftclass
        keep track of id :   tokenId -> id
        keep track of uri :  tokenId -> uri
    */
    mapping(bytes32 => string) public classMapping;
    mapping(bytes32 => string) public idMapping;
    mapping(bytes32 => string) public uriMapping;

    struct NftMapValue {
        string  class;
        string  id;
        string  uri;
    }

    function sendTransfer(
        bytes32 tokenId,
        string  calldata receiver,
        string  calldata cls,
        string  calldata destChain,
        string  calldata relayChain
    )override virtual external{
        // sourceChain cannot be equal to destChain
        // todo
        string memory sourceChain = "irishub";

        require(strings.equals(strings.toSlice(sourceChain),strings.toSlice(destChain)), "sourceChain can't equal to destChain");

        // get the next sequence
        // todo
        uint64 sequence = 1;


        if ( _determineAwayFromOrigin(cls, destChain)) {
            // nft is away from origin
            // lock nft (transfer nft to contract address)
            _transferFrom(msg.sender, address(bank), Bytes.bytes32ToUint(tokenId), uint256(1), "");
        } else{
            // nft is be closed to origin
            // burn nft
            _burn(msg.sender, Bytes.bytes32ToUint(tokenId), uint256(1));
        }
    
        //NftMapValue memory mapData = _getInfoByTokenId(tokenId);

        // send packet

        // todo  stack too deep 
        // packet.sendPacket(sequence, sourceChain, destChain, relayChain, NftTransfer.encode(
        //     NftTransfer.Data({
        //     class : mapData.class,
        //     id : mapData.id,
        //     uri : mapData.uri,
        //     sender: Bytes.addressToString(msg.sender),
        //     receiver: receiver,
        //     awayFromOrigin :  _determineAwayFromOrigin(cls, destChain)
        //     })
        // ));
    }

    // Module callbacks
    function onRecvPacket(PacketTypes.Packet calldata pac) external override returns (bytes memory acknowledgement) {
        NftTransfer.Data memory data = NftTransfer.decode(pac.data);
        console.log("ggggg:", data.id);
        console.logBytes32(data.id.stringToBytes32()) ;
        
        
        // sourceChain/nftClass
        string memory scNft;
        string memory newClass;
        if (data.awayFromOrigin) {
            if (strings.startsWith(strings.toSlice(data.class), strings.toSlice(PREFIX))){
                // tibc/nft/A/nftClass -> tibc/nft/A/B/nftClass
                // tibc/nft/A/nftClass -> [tibc][nft][A][nftClass]
                string[] memory classSplit = _splitStringIntoArray(data.class, "/");
                string   memory temp = classSplit[classSplit.length-1];

                // [tibc][nft][A][nftClass] -> [tibc][nft][A][B]
                classSplit[classSplit.length-1] = pac.sourceChain; 

                // [tibc][nft][A][B] -> "tibc/nft/A/B"
                newClass = strings.join(strings.toSlice("/"), _convertStringArrayIntoSliceArray(classSplit));

                // "tibc/nft/A/B" -> "tibc/nft/A/B/nftClass"
                newClass = newClass.toSlice().concat("/".toSlice()).toSlice().concat(temp.toSlice());

                // get sourceChain/nftClass   
                //example : tibc/nft/A/B/nftClass -> A/nftClass || tibc/nft/A/nftClass -> A/nftClass
                scNft = _getSCNft(data.class);
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
            console.logBytes32(tokenId);

            // mint nft
            bool success = _mint(data.receiver.parseAddr(), Bytes.bytes32ToUint(tokenId), uint256(1), "");

            if (success){
                // keep trace of class and id and uri
                setIdMapping(tokenId, data.id);
                setUriMapping(tokenId, data.uri);
                setClassMapping(tokenId, newClass);
            }
           
            return _newAcknowledgement(success);
        } else{
            // go back to source chain
            require(strings.startsWith(data.class.toSlice(), PREFIX.toSlice()), "class has no prefix");
            string[] memory classSplit = _splitStringIntoArray(data.class, "/");

            if (classSplit.length == 4) {
                // scenes: A_chain receive packet from B_chain
                scNft = _getSCNft(data.class);
                                                      
                // tibc/nft/A/nftClass -> nftClass
                newClass = classSplit[classSplit.length-1];
            } else {
                // scenes: B_chain receive packet from C_chain
                scNft = _getSCNft(data.class);

                // [tibc][nft][A][B][nftClass] -> [tibc][nft][A][nftClass]
                newClass = classSplit[0].toSlice()
                                        .concat(classSplit[1].toSlice()).toSlice()
                                        .concat(classSplit[2].toSlice()).toSlice()
                                        .concat(classSplit[classSplit.length - 1].toSlice());

                newClass = strings.join("/".toSlice(), _convertStringArrayIntoSliceArray(classSplit));
            }

            // generate tokenId
            bytes32 tokenId = _calTokenId(scNft, data.id);

            // unlock
            return _newAcknowledgement(
                _transferFrom(address(bank), data.receiver.parseAddr(), Bytes.bytes32ToUint(tokenId), uint256(1), "")
            );
        }

    }

    function onAcknowledgementPacket(PacketTypes.Packet calldata pac, bytes calldata acknowledgement) external override {
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(NftTransfer.decode(pac.data), pac.sourceChain);
        }
    }

    /// Internal functions ///
    function _burn(address account,uint256 id,uint256 amount) internal virtual returns(bool){
        console.log("start to burn ");
            console.logAddress(account);
            console.logUint(id);
            console.logUint(amount);
        try bank.burn(account, id, amount) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    function _mint(address account,uint256 id,uint256 amount,bytes memory data) internal virtual returns(bool){
        try bank.mint(account, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    function _transferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) internal virtual returns(bool){
        try bank.transferFrom(from, to, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }


    function _getInfoByTokenId(bytes32 tokenId)internal view returns(NftMapValue memory){
        NftMapValue memory data =  NftMapValue({
                class : classMapping[tokenId],
                id    : idMapping[tokenId],
                uri   : uriMapping[tokenId]
        });
        return data;
    }

    /* @notice   This method is to obtain the splicing of the source chain and nftclass from the cross-chain nft prefix
     * The realization is aimed at the following two situations
     * 1. tibc/nft/A/nftClass   -> A/nftClass
     * 2. tibc/nft/A/B/nftClass -> A/nftClass 
     * @param class    classification of cross-chain nft assets
     */
    function _getSCNft(string memory class) internal pure returns(string memory){
        string[] memory classSplit = _splitStringIntoArray(class, "/");
        string memory scNft; 
        scNft = classSplit[2].toSlice().concat("/".toSlice()).toSlice().concat(classSplit[classSplit.length-1].toSlice());
        return scNft;
    }


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
            _transferFrom(address(bank), msg.sender, Bytes.bytes32ToUint(tokenId), uint256(1), "");
        } else{
            // tibc/nft/A/B/nftClass
            // mint nft
            _mint(msg.sender, Bytes.bytes32ToUint(tokenId), uint256(1), "");
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
    function _determineAwayFromOrigin(string memory class, string memory destChain) internal pure returns (bool){
        if (!strings.startsWith(class.toSlice(), PREFIX.toSlice())){
            return true;
        }

        string[] memory classSplit = _splitStringIntoArray(class, "/");
        return !strings.equals(classSplit[classSplit.length-2].toSlice(), destChain.toSlice());
    }

    /* @notice   This method is to split string into string array
     * example : "tibc/nft/A" -> [tibc][nft][A]
     * @param newClass   string to be split
     * @param delim      delim
     */
    function _splitStringIntoArray(string memory newClass, string memory delim)internal pure returns (string[] memory){
        strings.slice memory newClassSlice = newClass.toSlice();
        strings.slice memory delimSlice = delim.toSlice();
        string[]memory parts = new string[](newClassSlice.count(delimSlice) + 1);
        for(uint i = 0; i < parts.length; i++) {
            parts[i] = newClassSlice.split(delimSlice).toString();
        }
        return parts;
    }

    /* @notice   This method is to convert stringArray into sliceArray
     * @param    src   
     */
    function _convertStringArrayIntoSliceArray(string[] memory src) internal pure returns(strings.slice[] memory){
        strings.slice[] memory res = new strings.slice[](src.length);
        for(uint i = 0; i < src.length; i++) {
            res[i] = src[i].toSlice();
        }
        return res;
    }

    /* @notice   calculate the hash of scNft and id, take the high 128 bits, and concatenate them into new 32-byte data
     * example : tokenId := high128(hash(wenchang/nftclass)) + high128(hash(id))
     * @param    scNft   souceChain/nftClass
     * @param    id      Nft id from other blockchain systems
     */
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

    function setIdMapping(bytes32 tokenId, string memory id)internal{
        idMapping[tokenId] = id;
    }

    function setUriMapping(bytes32 tokenId, string memory uri)internal{
        uriMapping[tokenId] = uri;
    }


    function getClass(bytes32 tokenId)public view returns (string memory){
            return classMapping[tokenId];
    }

    function getid(bytes32 tokenId)public view returns (string memory){
            return idMapping[tokenId];
    }

    function getUri(bytes32 tokenId)public view returns (string memory){
            return uriMapping[tokenId];
    }
}
