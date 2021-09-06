// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/04-packet/Packet.sol";
import "../libraries/Types.sol";

interface IPacket {
    function sendPacket(
        PacketTypes.Packet calldata packet
    ) external;


    function recvPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external;
}
