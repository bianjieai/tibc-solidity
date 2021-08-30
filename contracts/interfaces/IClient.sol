// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/Types.sol";

interface IClient {
    function getLatestHeight() external view returns (Height.Data memory);

    function initialize(
        bytes calldata clientState,
        bytes calldata consensusState
    ) external;

    function upgrade(bytes calldata clientState, bytes calldata consensusState)
        external;

    function status() external view returns (int8);

    function checkHeaderAndUpdateState(bytes calldata header) external;

    function verifyPacketCommitment(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata commitmentBytes
    ) external;

    function verifyPacketAcknowledgement(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata acknowledgement
    ) external;

    function verifyPacketCleanCommitment(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence
    ) external;
}
