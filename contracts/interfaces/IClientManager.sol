// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./IConsensusState.sol";

interface IClientManager {
    function getClient(string calldata chainName) external returns (address);
}
