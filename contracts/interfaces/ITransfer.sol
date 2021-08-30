// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;
import "./IModule.sol";

interface ITransfer is IModule {
    function sendTransfer(
        bytes32 tokenId,
        string  calldata receiver,
        string  calldata cls,
        string  calldata destChain,
        string  calldata relayChain
    )external;
}