// SPDX-License-Identifier: Apache-License
pragma solidity ^0.8.0;

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
        uint64 revisionNumber,
        uint64 revisionHeight,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        string calldata sequence,
        bytes calldata commitmentBytes
    ) external;

    function verifyPacketAcknowledgement(
        uint64 revisionNumber,
        uint64 revisionHeight,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        string calldata sequence,
        bytes calldata acknowledgement
    ) external;

    function verifyPacketCleanCommitment(
        uint64 revisionNumber,
        uint64 revisionHeight,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        string calldata sequence
    ) external;
}
