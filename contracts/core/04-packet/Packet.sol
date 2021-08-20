// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../02-client/ClientManager.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/04-packet/Packet.sol";
import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "../../interfaces/IModule.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract Packet is ReentrancyGuard {
    address public clientManagerAddress;

    // port -> module app implementation address
    mapping(string => IModule) public modules;

    function sendPacket(
        uint64 sequence,
        string calldata sourceChain,
        string calldata destChain,
        string calldata relayChain,
        bytes calldata data
    ) external nonReentrant {}

    function recvPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata proof,
        ClientTypes.Height calldata height
    ) external nonReentrant {
        IClient client = IClientManager(clientManagerAddress).getClient(
            packet.sourceChain
        );
        client.verifyPacketCommitment(
            height,
            proof,
            packet.sourceChain,
            packet.destChain,
            packet.sequence,
            packet.data
        );
        IModule module = modules[packet.port];
        module.onRecvPacket(packet);
    }

    function acknowledgePacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement,
        bytes calldata proofAcked,
        ClientTypes.Height calldata height
    ) external nonReentrant {
        IClient client = IClient(
            IClientManager(clientManagerAddress).getClient(packet.destChain)
        );
        client.verifyPacketAcknowledgement(
            height,
            proofAcked,
            packet.sourceChain,
            packet.destChain,
            packet.sequence,
            acknowledgement
        );
        IModule module = modules[packet.port];
        module.onAcknowledgementPacket(packet, acknowledgement);
    }

    function cleanPacket(
        uint64 sequence,
        string calldata sourceChain,
        string calldata destChain,
        string calldata relayChain
    ) external nonReentrant {}

    function recvCleanPacket(
        uint64 sequence,
        string calldata sourceChain,
        string calldata destChain,
        string calldata relayChain,
        bytes calldata proof,
        ClientTypes.Height calldata height
    ) external nonReentrant {}

    function writeAcknowledgement(
        uint64 sequence,
        string calldata port,
        string calldata sourceChain,
        string calldata destChain,
        string calldata relayChain,
        bytes calldata data
    ) internal nonReentrant {}
}
