// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./Auth.sol";
import "../../../interfaces/IERC721Bank.sol";

contract ERC721Bank is ERC721Upgradeable, IERC721Bank, Auth {
    bytes32 public constant MINTER = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER = keccak256("BURNER_ROLE");
    mapping(uint256 => bytes) public uriMap;

    function initialize(address _owner) public initializer {
        __ERC721_init("", "");
        super.init(_owner);
    }

    /**
     * @notice this function is to create `amount` tokens of token type `id`, and assigns them to `account`.
     * - `account` cannot be the zero address.
     * - If `account` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     * @param account address of the account to assign the token to
     * @param id token id
     * @param data metadata to store with the token
     */
    function mint(
        address account,
        uint256 id,
        bytes memory data
    ) public override onlyAuthorizee(MINTER, msg.sender) {
        _mint(account, id);
        uriMap[id] = data;
    }

    /**
     * @notice this function is to destroys `amount` tokens of token type `id` from `account`
     * @param id token id
     */
    function burn(uint256 id)
        public
        override
        onlyAuthorizee(BURNER, msg.sender)
    {
        _burn(id);
        delete uriMap[id];
    }

    /**
     * @notice this function is to get uri from tokenId
     * @param id token id
     */
    function tokenURI(uint256 id) public view override returns (string memory) {
        // need to get uri function from transfer contract
        return string(uriMap[id]);
    }
}
