// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library String {
    function uint642str(
        uint64 _i
    )
    public
    pure
    returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint64 j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    /*
     * @notice Concatenate two strings into a single string
     * @param _first First string
     * @param _second Second string
     */
    function strConcat(
        string memory _first,
        string memory _second
    )
    public
    pure
    returns(string memory)
    {
        bytes memory first = bytes(_first);
        bytes memory second = bytes(_second);
        bytes memory res = new bytes(first.length + second.length);

        for(uint i = 0; i < first.length; i++) {
            res[i] = first[i];
        }

        for(uint j = 0; j < second.length; j++) {
            res[first.length+j] = second[j];
        }

        return string(res);
    }
}