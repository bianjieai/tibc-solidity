// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155Bank is IERC1155, ERC1155{

    function mint(address account,uint256 id,uint256 amount,bytes memory data) public virtual{
        _mint(account, id, amount, data);
    }

    function burn(address account,uint256 id,uint256 amount) public virtual{
        _burn(account, id, amount);
    }

    function transferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public virtual{
        safeTransferFrom(from, to, id, amount, data);
    }
}