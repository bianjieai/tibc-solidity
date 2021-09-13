// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";
import "../../../interfaces/IERC1155Bank.sol";

import "hardhat/console.sol";

contract ERC1155Bank is ERC1155, IERC1155Bank{

    constructor() public ERC1155("www.test.com") {
    }

    function mint(address account,uint256 id,uint256 amount,bytes memory data) public virtual override{
        _mint(account, id, amount, data);
    }

    function burn(address account,uint256 id,uint256 amount) public virtual override{
        _burn(account, id, amount);
    }

    function transferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public virtual override{
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function balanceOfAddr(address account, uint256 id) public view virtual returns (uint256) {
        super.balanceOf(account, id);
    }


}