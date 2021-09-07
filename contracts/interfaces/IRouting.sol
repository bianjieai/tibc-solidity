// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./IModule.sol";

interface IRouting {
    function authenticate(
        string calldata _sourceChain,
        string calldata _destChain,
        string calldata _port
    ) external view returns (bool);

    function getMoudle(string calldata _moduleName)
    external
    view
    returns (IModule);
}