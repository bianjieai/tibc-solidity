// SPDX-License-Identifier: Apache-License
pragma solidity ^0.8.0;

interface IModule {
    function onRecvPacket(
        uint64 sequence,
        string calldata port,
        string calldata sourceChain,
        string calldata destinationChain,
        string calldata relayChain,
        bytes calldata data
    ) external returns (bytes memory acknowledgement);

    function onAcknowledgementPacket(
        uint64 sequence,
        string calldata port,
        string calldata sourceChain,
        string calldata destinationChain,
        string calldata relayChain,
        bytes calldata data,
        bytes calldata acknowledgement
    ) external;
}
