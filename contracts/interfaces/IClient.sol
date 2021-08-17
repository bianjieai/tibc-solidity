// Apache-License: 2.0
pragma solidity ^0.8.0;

import "./IClientState.sol";

interface IClient {
    function getClientState(string calldata chainName)
        external
        returns (IClientState);
}
