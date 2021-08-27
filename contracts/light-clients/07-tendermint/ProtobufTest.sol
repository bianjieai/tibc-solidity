// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../libraries/Tendermint.sol";

contract ProtobufTest {
    CanonicalVote.Data public data;

    function decode(bytes calldata vodeBz) external {
        data = CanonicalVote.decode(vodeBz);
    }

    function encode() external view returns (bytes memory) {
        return CanonicalVote.encode(data);
    }
}
