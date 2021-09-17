// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract ERC1155Bank is ERC1155, IERC1155Bank {
    /*
        keep track of class: tokenId -> tibc/nft/wenchang/irishub/nftclass
        keep track of id :   tokenId -> id
        keep track of uri :  tokenId -> uri
    */
    struct NftMapValue {
        string class;
        string id;
        string uri;
    }
    mapping(uint256 => NftMapValue) public nftMapValue;

    constructor() public ERC1155("") {}

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

    /*  @notice        this function is to get uri from tokenId
     *
     *  @param id
     */
    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return nftMapValue[id].uri;
    }

    /*  @notice                 this function is to set value
     *
     *  @param tokenId          token Id
     *  @param cls              class
     *  @param id               id
     *  @param uri              uri
     */
    function setMapValue(
        uint256 tokenId,
        string calldata cls,
        string calldata id,
        string calldata uri
    ) external virtual override {
        nftMapValue[tokenId] = NftMapValue({class: cls, id: id, uri: uri});
    }

    /*  @notice                  this function is to get class
     *
     *  @param tokenId          token Id
     */
    function getClass(uint256 tokenId)
        public
        virtual
        override
        returns (string memory)
    {
        return nftMapValue[tokenId].class;
    }

    /*  @notice                  this function is to get id
     *
     *  @param tokenId          token Id
     */
    function getId(uint256 tokenId)
        external
        virtual
        override
        returns (string memory)
    {
        return nftMapValue[tokenId].id;
    }

    /*  @notice                  this function is to get uri
     *
     *  @param tokenId          token Id
     */
    function getUri(uint256 tokenId)
        external
        virtual
        override
        returns (string memory)
    {
        return nftMapValue[tokenId].uri;
    }
}
