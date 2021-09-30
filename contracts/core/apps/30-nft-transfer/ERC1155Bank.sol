// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../../../interfaces/IERC1155Bank.sol";

contract ERC1155Bank is Initializable, ERC1155Upgradeable, IERC1155Bank {
    address public owner;
    mapping(uint256 => OriginNFT) public traces;

    // check if caller is transferContract
    modifier onlyOwner() {
        require(msg.sender == owner, "caller not transfer contract");
        _;
    }

    /**
     * @notice this function is to create `amount` tokens of token type `id`, and assigns them to `account`.
     * - `account` cannot be the zero address.
     * - If `account` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     * @param account address of the account to assign the token to
     * @param id token id
     * @param amount amount of tokens to create
     * @param data metadata to store with the token
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
     * @notice this function is to destroys `amount` tokens of token type `id` from `account`
     * @param account address of the account to assign the token to
     * @param id token id
     * @param amount amount of tokens to create
     */
    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public virtual override {
        _burn(account, id, amount);
    }

    /**
     * @notice this function is to transfers `amount` tokens of token type `id` from `from` to `to`.
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must be have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     * @param from address of the sender
     * @param to address of the receiver
     * @param amount amount of tokens to transfer
     * @param data metadata to store with the token
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
     * @notice this function is to destroys `amount` tokens of token type `id` from `account`
     * - `account` cannot be the zero address.
     * @param account address of the account
     * @param id token id
     */
    function balanceOfAddr(address account, uint256 id)
        public
        view
        virtual
        returns (uint256)
    {
        return super.balanceOf(account, id);
    }

    /**
     * @notice this function is to get uri from tokenId
     * @param id token id
     */
    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return traces[id].uri;
    }

    /**
     * @notice Give the ownership of the current contract to TransferContract
     * @param _owner address of nft transfer Contract
     */
    function setOwner(address _owner) external override initializer {
        owner = _owner;
    }

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
    ) external override onlyOwner {
        traces[tokenId] = OriginNFT(nftClass, id, _uri);
    }

    /**
     * @notice Delete the binding relationship between origin hft and mint's nft in erc1155
     *  @param tokenId token Id
     */
    function unbind(uint256 tokenId)
        external
        override
        onlyOwner
        returns (OriginNFT memory nft)
    {
        nft = traces[tokenId];
        delete traces[tokenId];
    }

    function getBinding(uint256 tokenId)
        external
        view
        override
        returns (OriginNFT memory)
    {
        return traces[tokenId];
    }

    /**
     * @notice this function is to get class
     * @param tokenId token Id
     */
    function getClass(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return traces[tokenId].class;
    }

    /**
     * @notice this function is to get id
     * @param tokenId token Id
     */
    function getId(uint256 tokenId)
        external
        view
        virtual
        override
        returns (string memory)
    {
        return traces[tokenId].id;
    }

    /**
     * @notice this function is to get uri
     * @param tokenId token Id
     */
    function getUri(uint256 tokenId)
        external
        view
        virtual
        override
        returns (string memory)
    {
        return traces[tokenId].uri;
    }
}
