// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library MerkleLib {
    function hashFromByteSlices(bytes[] memory data)
        internal
        pure
        returns (bytes32)
    {
        uint256 n = data.length;
        uint256 offset = 0;

        if (n == 1) {
            return leafHash(data[0]);
        }

        bytes32[] memory merklePaths;
        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                bytes32 left = leafHash(data[offset + i]);
                bytes32 right = leafHash(data[offset + i + 1]);
                merklePaths[merklePaths.length] = innerHash(left, right);
            }
            offset += n;
            n = n / 2;
        }
        return merklePaths[merklePaths.length - 1];
    }

    function leafHash(bytes memory data) internal pure returns (bytes32) {
        bytes memory rs;
        rs[0] = bytes1("0");
        for (uint256 i = 0; i < data.length - 1; i++) {
            rs[i + 1] = data[i];
        }
        return sha256(rs);
    }

    function innerHash(bytes32 left, bytes32 right)
        internal
        pure
        returns (bytes32)
    {
        bytes memory rs;
        rs[0] = bytes1("1");

        uint256 offset = 1;
        for (uint256 i = 0; i < left.length - 1; i++) {
            rs[offset] = left[i];
            offset++;
        }

        for (uint256 i = 0; i < right.length - 1; i++) {
            rs[offset] = right[i];
            offset++;
        }
        return sha256(rs);
    }
}
