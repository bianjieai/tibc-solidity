// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

interface IPacket {
    function sendPacket(
        uint64 sequence,
        string calldata sourceChain,
        string calldata destChain,
        string calldata relayChain,
        bytes calldata data
    ) external;
}
