// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;
import "./IModule.sol";

interface ITransfer is IModule {
    function sendTransfer(
        uint256 tokenId,
        string  calldata receiver,
        string  calldata cls,
        string  calldata destChain,
        string  calldata relayChain
    )external;
}