// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract AccessManager is AccessControlUpgradeable {
    // clientManager
    bytes32 public constant CREATE_CLIENT_ROLE =
        keccak256("CREATE_CLIENT_ROLE");
    bytes32 public constant UPDATE_CLIENT_ROLE =
        keccak256("UPDATE_CLIENT_ROLE");
    bytes32 public constant UPGRADE_CLIENT_ROLE =
        keccak256("UPGRADE_CLIENT_ROLE");
    bytes32 public constant REGISTER_RELAYER_ROLE =
        keccak256("REGISTER_RELAYER_ROLE");

    // packet
    bytes32 public constant SEND_PACKET_ROLE = keccak256("SEND_PACKET_ROLE");
    bytes32 public constant SET_CLIENT_MANAGER_ROLE =
        keccak256("SET_CLIENT_MANAGER_ROLE");
    bytes32 public constant SET_ROUTING_ROLE = keccak256("SET_ROUTING_ROLE");

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
    address multiSignAddr; 

    // check if caller is multi-signature contract address
    modifier onlyMultiSignAddr() {
        require(
            msg.sender == multiSignAddr,
            "caller not multi-signature contract address"
        );
        _;
    }

    function initialize(address _multiSignAddr) public initializer {
        multiSignAddr = _multiSignAddr;
        _setupRole(DEFAULT_ADMIN_ROLE, multiSignAddr);

        // clientManager
        _setupRole(CREATE_CLIENT_ROLE, msg.sender);
        _setupRole(UPDATE_CLIENT_ROLE, msg.sender);
        _setupRole(UPGRADE_CLIENT_ROLE, msg.sender);
        _setupRole(REGISTER_RELAYER_ROLE, msg.sender);

        // packet
        _setupRole(SEND_PACKET_ROLE, msg.sender);
        _setupRole(SET_CLIENT_MANAGER_ROLE, msg.sender);
        _setupRole(SET_ROUTING_ROLE, msg.sender);

        // routing
        _setupRole(SET_ROUTING_ROULES_ROLE, msg.sender);
        _setupRole(ADD_ROUTING_ROLE, msg.sender);

        // transfer
        _setupRole(ON_RECVPACKET_ROLE, msg.sender);
        _setupRole(ON_ACKNOWLEDGEMENT_PACKET_ROLE, msg.sender);

        // tendermint
        _setupRole(INITIALIZESTATE_ROLE, msg.sender);
        _setupRole(UPGRADE_ROLE, msg.sender);
        _setupRole(CHECK_HEADER_AND_UPDATE_STATE_ROLE, msg.sender);
    }

    /**
     *  @notice dynamically add roles through multi-signature contract addresses
     *  @param role       role
     *  @param account    the address corresponding to the role
     */
    function addRole(bytes32 role, address account) external onlyMultiSignAddr {
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
        onlyMultiSignAddr
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
        onlyMultiSignAddr
    {
        super.revokeRole(role, account);
    }
}
