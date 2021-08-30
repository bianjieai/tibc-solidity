// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library NftTransfer {
    // data definition
    struct Data {
        string class;
        string id;
        string uri;
        string sender;
        string receiver;
        bool awayFromOrigin;
    }


  /**
   * @dev The main decoder for memory
   * @param bs The bytes array to be decoded
   * @return The decoded struct
   */
  function decode(bytes memory bs) internal pure returns (Data memory) {
    //
  }



}

