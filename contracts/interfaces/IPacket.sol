// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/04-packet/Packet.sol";
import "../proto/Types.sol";

interface IPacket {
    /**
     * @notice send cross-chain data packets
     * @param packet cross-chain data packets
     */
    function sendPacket(PacketTypes.Packet calldata packet) external;

    /**
     * @notice receive cross-chain data packets from the sending chain
     * @param packet cross-chain data packets
     * @param proof proof of the existence of packet on the original chain
     * @param proof height of the proof
     */
    function recvPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external;

    /**
     * @notice receive cross-chain data packets from the sending chain
     * @param packet cross-chain data packets
     * @param acknowledgement confirmation message of packet on the receiving chain
     * @param proofAcked existence proof of acknowledgement on the receiving chain
     * @param height height of the proof
     */
    function acknowledgePacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement,
        bytes calldata proofAcked,
        Height.Data calldata height
    ) external;

    /**
     * @notice clean up expired cross-chain data packets
     * @param packet cross-chain data packets
     */
    function cleanPacket(PacketTypes.CleanPacket calldata packet) external;

    /**
     * @notice process cross-chain data packets from the sending chain
     * @param packet cross-chain data packets
     * @param proof confirmation message of packet on the receiving chain
     * @param height height of the proof
     */
    function recvCleanPacket(
        PacketTypes.CleanPacket calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external;

    /**
     * @notice get the next sequence of sourceChain/destChain
     * @param sourceChain source chain name
     * @param destChain destination chain name
     */
    function getNextSequenceSend(
        string calldata sourceChain,
        string calldata destChain
    ) external view returns (uint64);
}
