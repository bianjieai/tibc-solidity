// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library TransferDataTypes {
    struct TransferData {
        uint256 tokenId;
        string  receiver;
        string  class;
        string  destChain;
        string  relayChain;
        string  destContract;
    }
}