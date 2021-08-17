// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

interface IPacket {
    function sendPacket(
        uint64 sequence,
        string calldata sourceChain,
        string calldata destChain,
        string calldata relayChain,
        bytes calldata data
    ) external;
}