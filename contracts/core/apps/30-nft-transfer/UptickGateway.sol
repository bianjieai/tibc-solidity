// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract UptickGateway is OwnableUpgradeable {
    address[] public auths;
    IERC1155Bank public bank;

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
     * @param _owner the owner of the contract
     * @param _erc1155 the address of the ERC1155Bank contract
     */
    function initialize(address _owner,address _erc1155) public initializer {
        bank = IERC1155Bank(_erc1155);
        auths.push(_owner);

        __Ownable_init();
        super.transferOwnership(_owner);
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
        }
    }

    /**
     * @notice this function is to burn a nft
     * @param tokenId token id
     */
    function burn(uint256 tokenId) public onlyAuthorizee {
        bank.burn(msg.sender,tokenId,1);
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
}