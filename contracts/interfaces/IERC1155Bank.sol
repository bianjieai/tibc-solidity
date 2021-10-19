// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

interface IERC1155Bank {
    /*
        keep track of class: tokenId -> nft/{source-chain}/{dest-chain}/nftclass
        keep track of id :   tokenId -> id
        keep track of uri :  tokenId -> uri
    */
    struct OriginNFT {
        string class;
        string id;
        string uri;
    }

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

    function setOwner(address _owner) external;

}
