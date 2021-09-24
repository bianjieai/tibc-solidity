// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/04-packet/Packet.sol";

interface IModule {
    /**
     * @notice process cross-chain data packets from the sending chain
     * @param packet cross-chain data packets
     */
    function onRecvPacket(PacketTypes.Packet calldata packet)
        external
        returns (bytes memory acknowledgement);

    /**
     * @notice process confirmation information of cross-chain data packets
     * @param packet cross-chain data packets
     * @param acknowledgement after the data packet is accepted by the target chain, the acknowledgement message is returned
     */
    function onAcknowledgementPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement
    ) external;
}
