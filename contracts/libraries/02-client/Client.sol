// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library ClientTypes {
    struct Height {
        uint64 revisionNumber;
        uint64 revisionHeight;
    }
}
