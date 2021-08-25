// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../02-client/Client.sol";

library Types {
    struct ClientState {
        string chainId;
        Fraction trustLevel;
        uint64 trustingPeriod;
        uint64 unbondingPeriod;
        uint64 maxClockDrift;
        ClientTypes.Height latestHeight;
        bytes keyPrefix;
        uint64 timeDelay;
    }

    struct ConsensusState {
        uint64 timestamp;
        bytes root;
        bytes nextValidatorsHash;
    }

    struct Header {
        ClientTypes.Height trustedHeight;
        bytes root;
        bytes nextValidatorsHash;
    }

    struct Fraction {
        uint64 numerator;
        uint64 denominator;
    }
}
