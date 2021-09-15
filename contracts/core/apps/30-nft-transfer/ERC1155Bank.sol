// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract ERC1155Bank is Initializable, ERC1155Upgradeable, IERC1155Bank {
    function initialize() public initializer {}

    /*  @notice         this function is to create `amount` tokens of token type `id`, and assigns them to `account`.
     *
     *  @param account
     *  @param id
     *  @param amount
     *  @param data
     * - `account` cannot be the zero address.
     * - If `account` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        _mint(account, id, amount, data);
    }

    /*  @notice        this function is to destroys `amount` tokens of token type `id` from `account`
     *
     *  @param account
     *  @param id
     *  @param amount
     */
    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public virtual override {
        _burn(account, id, amount);
    }

    /*  @notice        this function is to transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     *  @param from
     *  @param to
     *  @param amount
     *  @param data
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must be have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    /*  @notice        this function is to destroys `amount` tokens of token type `id` from `account`
     *
     *  @param account
     *  @param id
     * - `account` cannot be the zero address.
     */
    function balanceOfAddr(address account, uint256 id)
        public
        view
        virtual
        returns (uint256)
    {
        super.balanceOf(account, id);
    }
}
