// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

interface IERC1155Bank {
    /*
        keep track of class: tokenId -> nft/wenchang/irishub/nftclass
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

    function transferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    function setOwner(address _owner) external;

    /**
     * @notice establish a binding relationship between origin nft and mint's nft in erc1155
     *  @param tokenId token Id
     *  @param nftClass class of origin NFT
     *  @param id id of origin NFT
     *  @param _uri uri of origin NFT
     */
    function bind(
        uint256 tokenId,
        string calldata nftClass,
        string calldata id,
        string calldata _uri
    ) external;

    function unbind(uint256 tokenId) external returns (OriginNFT memory);

    function getBinding(uint256 tokenId)
        external
        view
        returns (OriginNFT memory);

    function getClass(uint256 tokenId) external view returns (string memory);

    function getId(uint256 tokenId) external view returns (string memory);

    function getUri(uint256 tokenId) external view returns (string memory);
}
