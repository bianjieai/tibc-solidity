// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "../../../interfaces/IERC1155Bank.sol";
import "./Auth.sol";

contract ERC1155Bank is ERC1155Upgradeable, IERC1155Bank, Auth {
    bytes32 public constant MINTER = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER = keccak256("BURNER_ROLE");

    mapping(uint256 => bytes) public uriMap;

    function initialize(address _owner) public initializer {
        __ERC1155_init("");
        super.init(_owner);
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
    ) public override onlyAuthorizee(MINTER, msg.sender) {
        _mint(account, id, amount, data);
        uriMap[id] = data;
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
    ) public override onlyAuthorizee(BURNER, msg.sender) {
        _burn(account, id, amount);
        delete uriMap[id];
    }

    /**
     * @notice this function is to get uri from tokenId
     * @param id token id
     */
    function uri(uint256 id) public view override returns (string memory) {
        // need to get uri function from transfer contract
        return string(uriMap[id]);
    }

    /**
     * @notice customizing the metadata for your smart contract, refrence: https://docs.opensea.io/docs/contract-level-metadata
     */
    function contractURI() public view returns (string memory) {
        return "https://metadata-url.com/my-metadata";
    }
}