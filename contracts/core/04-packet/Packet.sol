// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../02-client/ClientManager.sol";
import "../../libraries/Types.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/04-packet/Packet.sol";
import "../../libraries/24-host/Host.sol";
import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "../../interfaces/IModule.sol";
import "../../interfaces/IPacket.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract Packet is ReentrancyGuard, IPacket {
    IClientManager public clientManager;

    mapping(bytes => uint64) public sequences;
    mapping(bytes => bytes32) public commitments;

    /**
     * @dev Make sure that the packet is valid
     */
    modifier validateBasic(
        uint64 sequence,
        bytes memory data
    ) {
        require(
            sequence > 0,
            "packet sequence cannot be 0"
        );
        require(
            data.length > 0,
            "packet data bytes cannot be empty"
        );
        _;
    }

    /**
    * @dev Event triggered when the packet is sent
    * @param packet packet data
    */
    event PacketSent(
        PacketTypes.Packet packet
    );

    /**
     * @dev SendPacket is called by a module in order to send an TIBC packet.
     * @param packet tibc packet
     */
    function sendPacket(
        PacketTypes.Packet calldata packet
    )
    external
    override
    nonReentrant
    validateBasic(packet.sequence, packet.data) {
        string memory targetChain;
        targetChain = packet.destChain;
        if (bytes(packet.relayChain).length > 0){
            targetChain = packet.relayChain;
        }
        IClient client = clientManager.getClient(targetChain);
        require(
            address(client) != address(0),
            "consensus state not found"
        );

        uint64 nextSequenceSend = sequences[Host.nextSequenceSendKey(packet.sourceChain, packet.destChain)];
        if (nextSequenceSend == 0){
            nextSequenceSend = 1;
        }
        require(
            packet.sequence == nextSequenceSend,
            "packet sequence ≠ next send sequence"
        );
        bytes32 commitment = sha256(packet.data);
        nextSequenceSend++;
        sequences[Host.nextSequenceSendKey(packet.sourceChain, packet.destChain)] = nextSequenceSend;
        commitments[Host.packetCommitmentKey(packet.sourceChain, packet.destChain, packet.sequence)] = commitment;

        emit PacketSent(
            packet
        );
    }

    /**
     * @dev recvPacket is called by a module in order to receive & process an TIBC packet
     * @param packet tibc packet
     * @param proof proof commit
     * @param height proof height
     */
    function recvPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    )
    external
    override
    nonReentrant
    {
        require(
            packet.sequence > sequences[Host.cleanPacketCommitmentKey(packet.sourceChain, packet.destChain)],
            "sequence illegal!"
        );
        bytes32 commitment = sha256(packet.data);
        bool isRelay;
        string memory targetChainName;

        if (keccak256(abi.encodePacked(packet.destChain)) == keccak256(abi.encodePacked(clientManager.getChainName()))) {
            if (bytes(packet.relayChain).length > 0){
                targetChainName = packet.relayChain;
            }else{
                targetChainName = packet.sourceChain;
            }
        }

        IClient client = clientManager.getClient(packet.sourceChain);
        require(
            address(client) != address(0),
            "consensus state not found"
        );
        client.verifyPacketCommitment(
            height,
            proof,
            packet.sourceChain,
            packet.destChain,
            packet.sequence,
            packet.data
        );
//        IModule module = modules[packet.port];
//        module.onRecvPacket(packet);
    }

    function acknowledgePacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement,
        bytes calldata proofAcked,
        Height.Data calldata height
    ) external nonReentrant {
        IClient client = clientManager.getClient(packet.destChain);
        client.verifyPacketAcknowledgement(
            height,
            proofAcked,
            packet.sourceChain,
            packet.destChain,
            packet.sequence,
            acknowledgement
        );
//        IModule module = modules[packet.port];
//        module.onAcknowledgementPacket(packet, acknowledgement);
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
        string memory port,
        string memory sourceChain,
        string memory destChain,
        string memory relayChain,
        bytes memory data
    ) internal nonReentrant {}
}
