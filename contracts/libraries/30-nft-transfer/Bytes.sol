// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;
library Bytes {
     function toAddress(bytes memory bz) internal pure returns (address addr) {
         require(bz.length == 20, "cannot convert into address");
         assembly {
             addr := mload(add(bz, 20))
         }
     }

     function toBytes32(bytes memory bz) internal pure returns (bytes32 ret) {
         require(bz.length == 32, "cannot convert into address");
         assembly {
             ret := mload(add(bz, 32))
         }
     }

     function toUint64(bytes memory _bytes, uint256 _start) internal pure returns (uint64 ret) {
         require(_bytes.length >= _start + 8, "toUint64_outOfBounds");
         assembly {
             ret := mload(add(add(_bytes, 0x8), _start))
         }
     }

    function toBytes(address a) public pure returns (bytes memory) {
        return abi.encodePacked(a);
    }


    function addressToString(address _address) internal pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes20 data = bytes20(_address);

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[2+1+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

 function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
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


    function toUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256) {
        require(_bytes.length >= _start + 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x20), _start))
        }

        return tempUint;
    }

    function stringToBytes32(string memory source) public pure returns (bytes32) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        bytes32 result;
        assembly {
            result := mload(add(source, 32))
        }
        return result;
    }

     function bytes32ToUint(bytes32 b) internal pure returns (uint256){
        uint256 number;
        for(uint i= 0; i < b.length; i++) {
            number = number + uint8(b[i])*(2**(8*(b.length-(i+1))));
        }
        return  number;
    }

     function uintToBytes(uint256 x) internal pure returns (bytes memory c) {
        bytes32 b = bytes32(x);
        c = new bytes(32);
        for (uint i=0; i < 32; i++) {
            c[i] = b[i];
        }
    }

    function bytes32ToString(bytes32 x) internal pure returns(string memory){
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for(uint j = 0 ; j<32;j++){
            bytes1 char = bytes1(bytes32(uint(x) * 2 **(8 * j)));
            if(char != 0){
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for(uint j = 0;j < charCount; j++){
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }


    // 32 bytes take high 128 bits
    function cutBytes32(bytes32 source) internal pure returns (bytes memory){
        bytes memory half = new bytes(16);
        for (uint j = 0; j < 16; j++) {
                half[j] = source[j];
        }
        return half;
    }

    // concat two byte arrays
    function concat(bytes memory self, bytes memory other) internal pure returns(bytes memory){
        bytes memory merged = new bytes(self.length + other.length);

        uint k = 0;
        for (uint i = 0; i < self.length; i++) {
            merged[k] = self[i];
            k++;
        }

        for (uint i = 0; i < other.length; i++) {
            merged[k] = other[i];
            k++;
        }
        return merged;
    }

}