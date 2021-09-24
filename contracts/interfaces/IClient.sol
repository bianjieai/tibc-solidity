// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../proto/Types.sol";

interface IClient {
    enum Status {
        Active,
        Expired,
        Unknown
    }

    /**
     * @notice return the current latest height of the light client
     * @return the current latest height of the light client
     */
    function getLatestHeight() external view returns (Height.Data memory);

    /**
     * @notice use the specified clientState, consensusState to initialize the light client state
     * @param clientState initial configuration of light client
     * @param consensusState The consensus state of the light client under the current clientState
     */
    function initializeState(
        bytes calldata clientState,
        bytes calldata consensusState
    ) external;

    /**
     * @notice when the light client status is sent incorrectly, the light client status needs to be upgraded
     * @param clientState initial configuration of light client
     * @param consensusState The consensus state of the light client under the current clientState
     */
    function upgrade(bytes calldata clientState, bytes calldata consensusState)
        external;

    /**
     * @notice return the status of the current light client
     * @return the status of the current light client
     */
    function status() external view returns (Status);

    /**
     * @notice check the header and update clientState, consensusState
     * @param header the consensus block header of the target chain
     */
    function checkHeaderAndUpdateState(bytes calldata header) external;

    /**
     * @notice verify the commitment of the cross-chain data package
     * @param height the height of cross-chain data packet proof
     * @param proof proof of the existence of commitmentBytes on the original chain
     * @param sourceChain the chain name of the source chain
     * @param destChain the chain name of the destination chain
     * @param sequence the sequence of the cross-chain data packet
     * @param commitmentBytes the commitment of the cross-chain data packet
     */
    function verifyPacketCommitment(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata commitmentBytes
    ) external view;

    /**
     * @notice verify the Acknowledgement of the cross-chain data package
     * @param height the height of cross-chain data packet proof
     * @param proof proof of the existence of commitmentBytes on the original chain
     * @param sourceChain the chain name of the source chain
     * @param destChain the chain name of the destination chain
     * @param sequence the sequence of the cross-chain data packet
     * @param acknowledgement the acknowledgement of the cross-chain data packet
     */
    function verifyPacketAcknowledgement(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata acknowledgement
    ) external view;

    /**
     * @notice verify the CleanCommitment of the cross-chain data package
     * @param height the height of cross-chain data packet proof
     * @param proof proof of the existence of commitmentBytes on the original chain
     * @param sourceChain the chain name of the source chain
     * @param destChain the chain name of the destination chain
     * @param sequence the sequence of the cross-chain data packet
     */
    function verifyPacketCleanCommitment(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence
    ) external view;
}
