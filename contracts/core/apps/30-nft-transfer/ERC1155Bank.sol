// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract ERC1155Bank is ERC1155, IERC1155Bank {
    constructor() public ERC1155("") {}

    /**
     * @dev Creates `amount` tokens of token type `id`, and assigns them to `account`.
     *
     *
     * Requirements:
     *
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

    /**
     * @dev Destroys `amount` tokens of token type `id` from `account`
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens of token type `id`.
     */
    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public virtual override {
        _burn(account, id, amount);
    }

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     *
     * Requirements:
     *
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

    /**
     *
     * Requirements:
     *
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
