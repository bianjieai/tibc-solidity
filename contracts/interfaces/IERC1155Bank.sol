// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

interface IERC1155Bank {
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) external;

    function transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    function setMapValue(
        uint256 tokenId,
        string calldata cls,
        string calldata id,
        string calldata uri
    ) external;

    function getClass(uint256 tokenId) external view returns (string memory);

    function getId(uint256 tokenId) external view returns (string memory);

    function getUri(uint256 tokenId) external view returns (string memory);
}
