// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../proto/Types.sol";

library TimeLib {
    function getLocalTime() internal view returns (int64) {
        return int64(block.timestamp);
    }

    function addSecnods(Timestamp.Data memory self, int64 secnods)
        internal
        pure
        returns (Timestamp.Data memory)
    {
        self.secs = self.secs + secnods;
        return self;
    }

    function add(Timestamp.Data memory self, Timestamp.Data memory t2)
        internal
        pure
        returns (Timestamp.Data memory)
    {
        self.secs += t2.secs;
        self.nanos += t2.nanos;
        return self;
    }

    function lessThan(Timestamp.Data memory self, Timestamp.Data memory t2)
        internal
        pure
        returns (bool)
    {
        if (self.secs < t2.secs) {
            return true;
        }
        if (self.nanos == t2.nanos && self.secs < t2.secs) {
            return true;
        }
        return false;
    }

    function greaterThan(Timestamp.Data memory self, Timestamp.Data memory t2)
        internal
        pure
        returns (bool)
    {
        if (self.secs > t2.secs) {
            return true;
        }
        if (self.nanos == t2.nanos && self.secs > t2.secs) {
            return true;
        }
        return false;
    }
}
