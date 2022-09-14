// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

interface IERC721Bank {
    function mint(
        address account,
        uint256 id,
        bytes calldata data
    ) external;

    function burn(uint256 tokenId) external;
}
