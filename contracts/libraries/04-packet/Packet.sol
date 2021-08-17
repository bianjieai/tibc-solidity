// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

library PacketTypes {
    struct Packet {
        uint64 sequence;
        string port;
        string sourceChain;
        string destChain;
        string relayChain;
        bytes data;
    }
}
