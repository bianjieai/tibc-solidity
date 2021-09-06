// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library PacketTypes {
    struct Packet {
        uint64 sequence;
        string port;
        string sourceChain;
        string destChain;
        string relayChain;
        bytes data;
    }

    struct CleanPacket {
        uint64 sequence;
        string sourceChain;
        string destChain;
        string relayChain;
    }
}
