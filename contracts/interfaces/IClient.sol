// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../libraries/02-client/Client.sol";

interface IClient {
    function getLatestHeight()
        external
        view
        returns (ClientTypes.Height memory);

    function initialize(
        bytes calldata clientState,
        bytes calldata consensusState
    ) external;

    function upgrade(bytes calldata clientState, bytes calldata consensusState)
        external;

    function status() external view returns (int8);

    function checkHeaderAndUpdateState(bytes calldata header) external;

    function verifyPacketCommitment(
        ClientTypes.Height calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata commitmentBytes
    ) external;

    function verifyPacketAcknowledgement(
        ClientTypes.Height calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata acknowledgement
    ) external;

    function verifyPacketCleanCommitment(
        ClientTypes.Height calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence
    ) external;
}
