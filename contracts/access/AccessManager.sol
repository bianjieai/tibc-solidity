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
    bytes32 public constant SET_ROUTING_ROULES_ROLE =
        keccak256("SET_ROUTING_ROULES_ROLE");
    bytes32 public constant ADD_ROUTING_ROLE = keccak256("ADD_ROUTING_ROLE");

    // transfer
    bytes32 public constant ON_RECVPACKET_ROLE =
        keccak256("ON_RECVPACKET_ROLE");
    bytes32 public constant ON_ACKNOWLEDGEMENT_PACKET_ROLE =
        keccak256("ON_ACKNOWLEDGEMENT_PACKET_ROLE");

    // tendermint
    bytes32 public constant INITIALIZESTATE_ROLE =
        keccak256("INITIALIZESTATE_ROLE");
    bytes32 public constant UPGRADE_ROLE = keccak256("UPGRADE_ROLE");
    bytes32 public constant CHECK_HEADER_AND_UPDATE_STATE_ROLE =
        keccak256("CHECK_HEADER_AND_UPDATE_STATE_ROLE");

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
        _setupRole(SET_ROUTING_ROULES_ROLE, _multiSignWallet);
        _setupRole(ADD_ROUTING_ROLE, _multiSignWallet);

        // transfer
        _setupRole(ON_RECVPACKET_ROLE, _multiSignWallet);
        _setupRole(ON_ACKNOWLEDGEMENT_PACKET_ROLE, _multiSignWallet);

        // tendermint
        _setupRole(INITIALIZESTATE_ROLE, _multiSignWallet);
        _setupRole(UPGRADE_ROLE, _multiSignWallet);
        _setupRole(CHECK_HEADER_AND_UPDATE_STATE_ROLE, _multiSignWallet);
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
}
