// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./IConsensusState.sol";
import "./IClient.sol";

interface IClientManager {
    /**
     * @notice get light client
     * @param chainName the name of the chain
     * @return returns the light client instance of the specified chainName
     */
    function getClient(string calldata chainName) external returns (IClient);

    /**
     * @notice get the name of this chain
     * @return returns the name of this chain
     */
    function getChainName() external view returns (string memory);

    /**
     * @notice get the current latest height of the light client of the specified chainName
     * @return return the current latest height of the light client of the specified chainName
     */
    function getLatestHeight(string calldata chainName)
        external
        view
        returns (Height.Data memory);
}
