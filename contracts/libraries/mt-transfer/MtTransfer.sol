// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

library TransferDataTypes {
    struct TransferData {
        uint256 tokenId;
        string sender;
        string receiver;
        string class;
        string destChain;
        string relayChain;
        string destContract;
        uint64 amount;
    }

    /*
        keep track of class: tokenId -> nft/{source-chain}/{dest-chain}/nftclass
        keep track of id :   tokenId -> id
        keep track of uri :  tokenId -> uri
    */
    struct OriginMT {
        string class;
        string id;
        bytes data;
    }
}
