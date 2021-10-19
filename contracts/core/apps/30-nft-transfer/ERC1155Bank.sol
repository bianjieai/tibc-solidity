// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract ERC1155Bank is Initializable, ERC1155Upgradeable, IERC1155Bank {
    address public owner;

    // check if caller is transferContract
    modifier onlyOwner() {
        require(msg.sender == owner, "caller not transfer contract");
        _;
    }

    /**
     * @notice this function is to create `amount` tokens of token type `id`, and assigns them to `account`.
     * - `account` cannot be the zero address.
     * - If `account` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     * @param account address of the account to assign the token to
     * @param id token id
     * @param amount amount of tokens to create
     * @param data metadata to store with the token
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public  override onlyOwner{
        _mint(account, id, amount, data);
    }

    /**
     * @notice this function is to destroys `amount` tokens of token type `id` from `account`
     * @param account address of the account to assign the token to
     * @param id token id
     * @param amount amount of tokens to create
     */
    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public  override onlyOwner{
        _burn(account, id, amount);
    }

    /**
     * @notice this function is to destroys `amount` tokens of token type `id` from `account`
     * - `account` cannot be the zero address.
     * @param account address of the account
     * @param id token id
     */
    function balanceOfAddr(address account, uint256 id)
        public
        view
        virtual
        returns (uint256)
    {
        return super.balanceOf(account, id);
    }

    /**
     * @notice this function is to get uri from tokenId
     * @param id token id
     */
    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        // need to get uri function from transfer contract
        // return traces[id].uri
        return "";
    }

    /**
     * @notice Give the ownership of the current contract to TransferContract
     * @param _owner address of nft transfer Contract
     */
    function setOwner(address _owner) external override initializer {
        owner = _owner;
    }
    
}
