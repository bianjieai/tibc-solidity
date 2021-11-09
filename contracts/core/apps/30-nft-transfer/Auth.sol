// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Auth is OwnableUpgradeable {
    mapping(bytes32 => mapping(address => bool)) public roles;

    function init(address _owner) public initializer {
        __Ownable_init();
        super.transferOwnership(_owner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyAuthorizee(bytes32 role, address account) {
        require(roles[role][account], "unauthorized");
        _;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     */
    function grantRole(bytes32 role, address account) public onlyOwner {
        roles[role][account] = true;
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     */
    function revokeRole(bytes32 role, address account) public onlyOwner {
        delete roles[role][account];
    }
}