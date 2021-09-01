// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./Types.sol";

library TimeLib {
    function getLocalTime() internal view returns (int64) {
        return int64(block.timestamp);
    }

    function addSecnods(Timestamp.Data memory time, int64 secnods)
        internal
        pure
        returns (Timestamp.Data memory)
    {
        time.secs = time.secs + secnods;
        return time;
    }

    function add(Timestamp.Data memory t1, Timestamp.Data memory t2)
        internal
        pure
        returns (Timestamp.Data memory)
    {
        t1.secs += t2.secs;
        t1.nanos += t2.nanos;
        return t1;
    }

    function lessThan(Timestamp.Data memory t1, Timestamp.Data memory t2)
        internal
        pure
        returns (bool)
    {
        if (t1.secs < t2.secs) {
            return true;
        }
        if (t1.nanos == t2.nanos && t1.secs < t2.secs) {
            return true;
        }
        return false;
    }

    function greaterThan(Timestamp.Data memory t1, Timestamp.Data memory t2)
        internal
        pure
        returns (bool)
    {
        if (t1.secs > t2.secs) {
            return true;
        }
        if (t1.nanos == t2.nanos && t1.secs > t2.secs) {
            return true;
        }
        return false;
    }
}
