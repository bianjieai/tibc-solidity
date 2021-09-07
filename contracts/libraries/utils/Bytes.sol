// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library Bytes {
    function toAddress(bytes memory bz) internal pure returns (address addr) {
        require(bz.length == 20, "cannot convert into address");
        assembly {
            addr := mload(add(bz, 20))
        }
    }

    function toBytes32(bytes memory bz) internal pure returns (bytes32 ret) {
        require(bz.length == 32, "cannot convert into bytes32");
        assembly {
            ret := mload(add(bz, 32))
        }
    }

    function fromBytes32(bytes32 data) internal pure returns (bytes memory) {
        bytes memory result = new bytes(32);
        for (uint256 i = 0; i < 32; ++i) {
            result[i] = data[i];
        }
        return result;
    }

    function toUint64(bytes memory _bytes, uint256 _start)
        internal
        pure
        returns (uint64 ret)
    {
        require(_bytes.length >= _start + 8, "toUint64_outOfBounds");
        assembly {
            ret := mload(add(add(_bytes, 0x8), _start))
        }
    }

    function equal(bytes memory b1, bytes memory b2)
        internal
        pure
        returns (bool ret)
    {
        if (b1.length != b2.length) {
            return false;
        }
        for (uint256 i = 0; i < b1.length; ++i) {
            if (b1[i] != b2[i]) {
                return false;
            }
        }
        return true;
    }

    function hasPrefix(bytes memory s, bytes memory prefix)
        internal
        pure
        returns (bool)
    {
        if (s.length < prefix.length) {
            return false;
        }
        for (uint256 i = 0; i < prefix.length; i++) {
            if (s[i] != prefix[i]) {
                return false;
            }
        }
        return true;
    }

    function concat(bytes memory b1, bytes memory b2)
        internal
        pure
        returns (bytes memory)
    {
        bytes memory ret = new bytes(b1.length + b2.length);
        for (uint256 i = 0; i < b1.length; i++) {
            ret[i] = b1[i];
        }
        for (uint256 i = 0; i < b2.length; i++) {
            ret[b1.length + i] = b2[i];
        }
        return ret;
    }
}
