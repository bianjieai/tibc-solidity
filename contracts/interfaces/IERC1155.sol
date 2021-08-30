// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

interface IERC1155{
    function mint(address account,uint256 id,uint256 amount,bytes memory data) external;

    function burn(address account,uint256 id,uint256 amount) external;

    function transferFrom(address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data) external;
}