// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./Memory.sol";

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

    function fromBytes32(bytes32 data)
        internal
        pure
        returns (bytes memory bts)
    {
        bts = new bytes(32);
        assembly {
            mstore(
                add(
                    bts,
                    /*BYTES_HEADER_SIZE*/
                    32
                ),
                data
            )
        }
    }

    function fromBytes1(bytes1 data) internal pure returns (bytes memory) {
        bytes memory result = new bytes(1);
        result[0] = data;
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

    function uint64ToBigEndian(uint64 v)
        internal
        pure
        returns (bytes memory ret)
    {
        ret = new bytes(8);
        ret[0] = bytes1(uint8(v >> 56));
        ret[1] = bytes1(uint8(v >> 48));
        ret[2] = bytes1(uint8(v >> 40));
        ret[3] = bytes1(uint8(v >> 32));
        ret[4] = bytes1(uint8(v >> 24));
        ret[5] = bytes1(uint8(v >> 16));
        ret[6] = bytes1(uint8(v >> 8));
        ret[7] = bytes1(uint8(v));
        return ret;
    }

    // Checks if two `bytes memory` variables are equal. This is done using hashing,
    // which is much more gas efficient then comparing each byte individually.
    // Equality means that:
    //  - 'self.length == other.length'
    //  - For 'n' in '[0, self.length)', 'self[n] == other[n]'
    function equals(bytes memory self, bytes memory other)
        internal
        pure
        returns (bool)
    {
        if (self.length != other.length) {
            return false;
        }
        uint256 addr;
        uint256 addr2;
        assembly {
            addr := add(
                self,
                /*BYTES_HEADER_SIZE*/
                32
            )
            addr2 := add(
                other,
                /*BYTES_HEADER_SIZE*/
                32
            )
        }
        return Memory.equals(addr, addr2, self.length);
    }

    // Copies 'len' bytes from 'self' into a new array, starting at the provided 'startIndex'.
    // Returns the new copy.
    // Requires that:
    //  - 'startIndex + len <= self.length'
    // The length of the substring is: 'len'
    function substr(
        bytes memory self,
        uint256 startIndex,
        uint256 len
    ) internal pure returns (bytes memory) {
        require(startIndex + len <= self.length);
        if (len == 0) {
            return hex"";
        }
        uint256 addr = Memory.dataPtr(self);
        return Memory.toBytes(addr + startIndex, len);
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

    // Combines 'self' and 'other' into a single array.
    // Returns the concatenated arrays:
    //  [self[0], self[1], ... , self[self.length - 1], other[0], other[1], ... , other[other.length - 1]]
    // The length of the new array is 'self.length + other.length'
    function concat(bytes memory self, bytes memory other)
        internal
        pure
        returns (bytes memory)
    {
        bytes memory ret = new bytes(self.length + other.length);
        (uint256 src, uint256 srcLen) = Memory.fromBytes(self);
        (uint256 src2, uint256 src2Len) = Memory.fromBytes(other);
        (uint256 dest, ) = Memory.fromBytes(ret);
        uint256 dest2 = dest + srcLen;
        Memory.copy(src, dest, srcLen);
        Memory.copy(src2, dest2, src2Len);
        return ret;
    }

    function bytes32ToUint(bytes32 b) internal pure returns (uint256) {
        uint256 number;
        for (uint256 i = 0; i < b.length; i++) {
            number = number + uint8(b[i]) * (2**(8 * (b.length - (i + 1))));
        }
        return number;
    }

    function addressToString(address _address)
        internal
        pure
        returns (string memory)
    {
        bytes memory alphabet = "0123456789abcdef";
        bytes20 data = bytes20(_address);

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
            str[2 + 1 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function parseAddr(string memory _a)
        internal
        pure
        returns (address _parsedAddress)
    {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint256 i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }

    // 32 bytes take high 128 bits
    function cutBytes32(bytes32 source) internal pure returns (bytes memory) {
        bytes memory half = new bytes(16);
        for (uint256 j = 0; j < 16; j++) {
            half[j] = source[j];
        }
        return half;
    }
}
