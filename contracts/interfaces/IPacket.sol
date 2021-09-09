// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/04-packet/Packet.sol";
import "../proto/Types.sol";

interface IPacket {
    function sendPacket(
        PacketTypes.Packet calldata packet
    ) external;

    function recvPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external;

    function acknowledgePacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement,
        bytes calldata proofAcked,
        Height.Data calldata height
    ) external;

    function cleanPacket(
        PacketTypes.CleanPacket calldata packet
    ) external;

    function recvCleanPacket(
        PacketTypes.CleanPacket calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external;

    function getNextSequenceSend(
        string calldata sourceChain,
        string calldata destChain
    )
    external
    returns (uint64);
}
