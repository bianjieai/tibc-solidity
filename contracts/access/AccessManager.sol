// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract AccessManager is AccessControlUpgradeable {
    // clientManager
    bytes32 public constant CREATE_CLIENT_ROLE =
        keccak256("CREATE_CLIENT_ROLE");
    bytes32 public constant UPGRADE_CLIENT_ROLE =
        keccak256("UPGRADE_CLIENT_ROLE");
    bytes32 public constant REGISTER_RELAYER_ROLE =
        keccak256("REGISTER_RELAYER_ROLE");

    // routing
    bytes32 public constant SET_ROUTING_RULES_ROLE =
        keccak256("SET_ROUTING_RULES_ROLE");
    bytes32 public constant ADD_ROUTING_ROLE = keccak256("ADD_ROUTING_ROLE");

    // transfer
    bytes32 public constant ON_RECVPACKET_ROLE =
        keccak256("ON_RECVPACKET_ROLE");
    bytes32 public constant ON_ACKNOWLEDGEMENT_PACKET_ROLE =
        keccak256("ON_ACKNOWLEDGEMENT_PACKET_ROLE");

    // multi-signature contract address
    address public multiSignWallet;

    // check if caller is multi-signature contract address
    modifier onlyMultiSignWallet() {
        require(
            msg.sender == multiSignWallet,
            "caller not multi-signature contract address"
        );
        _;
    }

    function initialize(address _multiSignWallet) public initializer {
        multiSignWallet = _multiSignWallet;
        _setupRole(DEFAULT_ADMIN_ROLE, multiSignWallet);

        // clientManager
        _setupRole(CREATE_CLIENT_ROLE, _multiSignWallet);
        _setupRole(UPGRADE_CLIENT_ROLE, _multiSignWallet);
        _setupRole(REGISTER_RELAYER_ROLE, _multiSignWallet);

        // routing
        _setupRole(SET_ROUTING_RULES_ROLE, _multiSignWallet);
        _setupRole(ADD_ROUTING_ROLE, _multiSignWallet);

        // transfer
        _setupRole(ON_RECVPACKET_ROLE, _multiSignWallet);
        _setupRole(ON_ACKNOWLEDGEMENT_PACKET_ROLE, _multiSignWallet);
    }

    /**
     *  @notice dynamically add roles through multi-signature contract addresses
     *  @param role       role
     *  @param account    the address corresponding to the role
     */
    function addRole(bytes32 role, address account)
        external
        onlyMultiSignWallet
    {
        _setupRole(role, account);
    }

    /**
     *  @notice authorize a designated role to an address through a multi-signature contract address
     *  @param role       role
     *  @param account    authorized  address
     */
    function grantRole(bytes32 role, address account)
        public
        override
        onlyMultiSignWallet
    {
        super.grantRole(role, account);
    }

    /**
     *  @notice cancel the authorization to assign a role to a certain address through the multi-signature contract address
     *  @param role       role
     *  @param account    deauthorized  address
     */
    function revokeRole(bytes32 role, address account)
        public
        override
        onlyMultiSignWallet
    {
        super.revokeRole(role, account);
    }

    /**
     *  @notice dynamically add roles through multi-signature contract addresses
     *  @param roles       collection of roles
     *  @param accounts    collection of accounts
     */
    function batchAddRole(bytes32[] calldata roles, address[] calldata accounts)
        external
        onlyMultiSignWallet
    {
        require(
            roles.length == accounts.length,
            "batchAdd: roles and accounts length mismatch"
        );

        for (uint256 i = 0; i < roles.length; ++i) {
            _setupRole(roles[i], accounts[i]);
        }
    }

    /**
     *  @notice volume authorization, roles and addresses need to be one-to-one correspondence
     *  @param roles      collection of roles
     *  @param accounts   collection of accounts
     */
    function batchGrantRole(bytes32[] calldata roles, address[] calldata accounts)
        external
        onlyMultiSignWallet
    {
        require(
            roles.length == accounts.length,
            "batchGrant: roles and accounts length mismatch"
        );

        for (uint256 i = 0; i < roles.length; ++i) {
            super.grantRole(roles[i], accounts[i]);
        }
    }

    /**
     *  @notice batch deauthorization, roles and addresses need to be one-to-one correspondence
     *  @param roles      collection of roles
     *  @param accounts   collection of accounts
     */
    function batchRevokeRole(bytes32[] calldata roles, address[] calldata accounts)
        external
        onlyMultiSignWallet
    {
        require(
            roles.length == accounts.length,
            "batchRevoke: roles and accounts length mismatch"
        );

        for (uint256 i = 0; i < roles.length; ++i) {
            super.revokeRole(roles[i], accounts[i]);
        }
    }
}
