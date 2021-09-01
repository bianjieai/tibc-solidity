// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./MerkleTree.sol";

contract TestMerkleTree {
    function hashFromByteSlices(bytes[] memory data)
        public
        pure
        returns (bytes32)
    {
        return MerkleTree.hashFromByteSlices(data);
    }
}
