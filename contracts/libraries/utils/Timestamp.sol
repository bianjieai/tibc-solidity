// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../proto/Types.sol";

library TimestampLib {
    function getLocalTime() internal view returns (int64) {
        return int64(block.timestamp);
    }

    function add(Timestamp.Data memory self, int64 secnods)
        internal
        pure
        returns (Timestamp.Data memory target)
    {
        target.secs = self.secs + secnods;
        target.nanos = self.nanos;
        return target;
    }

    function add(Timestamp.Data memory self, Timestamp.Data memory t2)
        internal
        pure
        returns (Timestamp.Data memory target)
    {
        target.secs = self.secs + t2.secs;
        target.nanos = self.nanos + t2.nanos;
        return target;
    }

    function lessThan(Timestamp.Data memory self, Timestamp.Data memory t2)
        internal
        pure
        returns (bool)
    {
        if (self.secs < t2.secs) {
            return true;
        }
        if (self.secs == t2.secs && self.nanos < t2.nanos) {
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
        if (self.secs == t2.secs && self.nanos > t2.nanos) {
            return true;
        }
        return false;
    }
}
