// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/04-packet/Packet.sol";

interface IModule {
    function onRecvPacket(PacketTypes.Packet calldata packet)
        external
        returns (bytes memory acknowledgement);

    function onAcknowledgementPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement
    ) external;
}
