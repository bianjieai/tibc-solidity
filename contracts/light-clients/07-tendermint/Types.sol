// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

library Types {
    struct ClientState {
        uint64 revisionNumber;
        uint64 revisionHeight;
    }

    struct ConsensusState {
        uint64 revisionNumber;
        uint64 revisionHeight;
    }
}
