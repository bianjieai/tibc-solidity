// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract UptickGateway is OwnableUpgradeable,ERC721Upgradeable {
    address[] public auths;
    IERC1155Bank public bank;
    mapping(uint256 =>  address) internal idCreatorMap;
    

    // check if caller is in auths list
    modifier onlyAuthorizee() {
        uint256 len = auths.length;
        bool exist = false;
        for(uint256 i = 0 ;i < len ;i ++ ){
            if(msg.sender == auths[i]){
                exist = true;
                break;
            }
        }
        require(exist,"do not have the right to mint or burn");
        _;
    }

    /**
     * @notice Initialize the contract, which is automatically called when the contract is deployed
     * @param owner the owner of the contract
     * @param erc1155 the address of the ERC1155Bank contract
     */
    function initialize(
        address owner,
        address erc1155,
        string memory name, 
        string memory symbol
    ) public initializer {
        bank = IERC1155Bank(erc1155);
        auths.push(owner);

        __Ownable_init();
        __ERC721_init(name, symbol);
        super.transferOwnership(owner);
    }

    /**
     * @notice this function is to mint a nft
     * @param to address of the account to assign the token to
     * @param tokenId token id
     * @param tokenURI token uri
     */
    function mint(
        address to,
        uint256 tokenId,
        string memory tokenURI
    ) public onlyAuthorizee{
        bank.mint(to, tokenId, 1,bytes(tokenURI));

        //lock the token to prevent anyone from transfering&burning it
        super._mint(owner(), tokenId);
        super._setTokenURI(tokenId, tokenURI);
        idCreatorMap[tokenId] = to;
    }

    /**
     * @notice this function is to mint a batch nft
     * @param tos address of the account to assign the token to
     * @param tokenIds token id
     * @param tokenURIs token uri
     */
    function mintBatch(
        address[] memory tos,
        uint256[] memory tokenIds,
        string[] memory tokenURIs
    ) public onlyAuthorizee{
        uint256 batchLen = tos.length;
        for(uint256 i = 0 ;i < batchLen ;i ++){
            bank.mint(tos[i], tokenIds[i], 1, bytes(tokenURIs[i]));

            //lock the token to prevent anyone from transfering&burning it
            super._mint(owner(), tokenIds[i]);
            super._setTokenURI(tokenIds[i], tokenURIs[i]);
            idCreatorMap[tokenIds[i]] = tos[i];
        }
    }

    /**
     * @notice this function is to burn a nft
     * @param tokenId token id
     */
    function burn(uint256 tokenId) public onlyAuthorizee {
        bank.burn(msg.sender,tokenId,1);
        super._burn(tokenId);
    }

    /**
     * @notice this function is to override ERC721Upgradeable's ownerOf function
     * @param tokenId token id
     */
    function ownerOf(uint256 tokenId) public view override returns (address) {
        return idCreatorMap[tokenId];
    }

    function getCreator(uint256 tokenId) external view returns(address){
        return idCreatorMap[tokenId];
    }

    function exists(uint256 tokenId) public view returns(bool) {
        return super._exists(tokenId);
    }

    /**
     * @notice add authorized person to authorized list
     * @param minter token id
     */
    function addAuth(address minter) public onlyOwner{
        auths.push(minter);
    }

    /**
     * @notice remove someone from the authorized list
     * @param minter token id
     */
    function delAuth(address minter) public onlyOwner{
        uint256 len = auths.length;
        for(uint256 i = 0 ;i < len ;i ++){
            if(auths[i] == minter){
                auths[i] = auths[len - 1];
                auths.pop();
                break;
            }
        }
    }

    /**
     * @notice delAllAuths delete all auth from the authorized list
     */
    function delAllAuths() public onlyOwner{
        uint256 len = auths.length;
        for(uint256 i = 0 ;i < len ;i ++){
            auths.pop();
        }
    }
}