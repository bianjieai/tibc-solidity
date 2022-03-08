// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;
import "./IModule.sol";
import "../../contracts/libraries/mt-transfer/MtTransfer.sol";

interface IMtTransfer is IModule {
    
    function sendTransfer(
        TransferDataTypes.TransferData calldata transferData
    )external;
    
}