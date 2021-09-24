// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./IModule.sol";

interface IRouting {
    /**
     * @notice check whether the cross-link routing is correct
     * @param sourceChain source chain name
     * @param destChain destination chain name
     * @param port packet receiving port (application module)
     */
    function authenticate(
        string calldata sourceChain,
        string calldata destChain,
        string calldata port
    ) external view returns (bool);

    /**
     * @notice get application contract instance
     * @param moduleName module name
     */
    function getMoudle(string calldata moduleName)
        external
        view
        returns (IModule);
}
