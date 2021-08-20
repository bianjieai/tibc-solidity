// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../libraries/02-client/Client.sol";

interface IClient {
    function clientType() external view returns (string memory);

    function getLatestHeight()
        external
        view
        returns (ClientTypes.Height memory);

    function validate() external view returns (bool);

    function getDelayTime() external view returns (uint64);

    function getDelayBlock() external view returns (uint64);

    function getPrefix() external view returns (uint64);

    function initialize(
        bytes calldata clientState,
        bytes calldata consensusState
    ) external;

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
