// SPDX-License-Identifier: Apache-License
pragma solidity ^0.8.0;

interface IPacket {
    function sendPacket(
        uint64 sequence,
        string sourceChain,
        string destChain,
        string relayChain,
        bytes calldata data
    )
}