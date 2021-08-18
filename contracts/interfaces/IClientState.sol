// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../libraries/02-client/Client.sol";
import "../libraries/04-packet/Packet.sol";

interface IClientState {
    function clientType() external view returns (string memory);

    function getLatestHeight()
        external
        view
        returns (uint64 revisionNumber, uint64 revisionHeight);

    function validate() external view returns (bool);

    function getDelayTime() external view returns (uint64);

    function getDelayBlock() external view returns (uint64);

    function getPrefix() external view returns (uint64);

    function initializeClient(bytes calldata consensusState) external;

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
