// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../proto/Types.sol";
import "../libraries/Timestamp.sol";
import "../proto/Tendermint.sol";
import "../proto/Validator.sol";
import "../libraries/07-tendermint/LightClient.sol";

contract TestLightClient {
    function verifyNonAdjacent(
        bytes memory trustedHeaderBz,
        bytes memory trustedValsBz,
        bytes memory untrustedHeaderBz,
        bytes memory untrustedValsBz,
        int64 trustingPeriod,
        Timestamp.Data memory nowTime,
        int64 maxClockDrift,
        Fraction.Data memory trustLevel
    ) public pure returns (bytes32) {
        LightClient.verifyNonAdjacent(
            SignedHeader.decode(trustedHeaderBz),
            ValidatorSet.decode(trustedValsBz),
            SignedHeader.decode(untrustedHeaderBz),
            ValidatorSet.decode(untrustedValsBz),
            trustingPeriod,
            nowTime,
            maxClockDrift,
            trustLevel
        );
    }

    // function verifyAdjacent(
    //     SignedHeader.Data memory trustedHeader,
    //     SignedHeader.Data memory untrustedHeader,
    //     ValidatorSet.Data memory untrustedVals,
    //     int64 trustingPeriod,
    //     Timestamp.Data memory nowTime,
    //     int64 maxClockDrift
    // ) public pure returns (bytes32) {
    //     LightClient.verifyAdjacent(
    //         trustedHeader,
    //         untrustedHeader,
    //         untrustedVals,
    //         trustingPeriod,
    //         nowTime,
    //         maxClockDrift
    //     );
    // }
}
