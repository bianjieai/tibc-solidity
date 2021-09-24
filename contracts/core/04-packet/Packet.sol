// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../02-client/ClientManager.sol";
import "../../proto/Types.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/04-packet/Packet.sol";
import "../../libraries/24-host/Host.sol";
import "../../libraries/utils/Bytes.sol";
import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "../../interfaces/IModule.sol";
import "../../interfaces/IPacket.sol";
import "../../interfaces/IRouting.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract Packet is Initializable, OwnableUpgradeable, IPacket {
    IClientManager public clientManager;
    IRouting public routing;

    mapping(bytes => uint64) public sequences;
    mapping(bytes => bytes32) public commitments;
    mapping(bytes => bool) public receipts;
    bytes public commitBytes;

    function initialize() public initializer {}

    /**
     * @notice Event triggered when the packet is sent
     * @param packet packet data
     */
    event PacketSent(PacketTypes.Packet packet);

    /**
     * @notice Event triggered when the write ack
     * @param packet packet data
     * @param ack ack bytes
     */
    event AckWritten(PacketTypes.Packet packet, bytes ack);

    /**
     * @notice Event triggered when the clean packet sent
     * @param packet clean packet data
     */
    event CleanPacketSent(PacketTypes.CleanPacket packet);

    /**
     * @notice Constructor
     * @param clientMgrContract clientManager address
     * @param routingContract routing address
     */
    constructor(address clientMgrContract, address routingContract) public {
        require(
            clientMgrContract != address(0) && routingContract != address(0),
            "clientManager or routing cannot be empty"
        );
        clientManager = IClientManager(clientMgrContract);
        routing = IRouting(routingContract);
    }

    /**
     * @notice Make sure that the packet is valid
     */
    modifier validateBasic(uint64 sequence, bytes memory data) {
        require(sequence > 0, "packet sequence cannot be 0");
        require(data.length > 0, "packet data bytes cannot be empty");
        _;
    }

    /**
     * @notice SendPacket is called by a module in order to send an TIBC packet.
     * @param packet tibc packet
     */
    function sendPacket(PacketTypes.Packet calldata packet)
        external
        override
        validateBasic(packet.sequence, packet.data)
    {
        string memory targetChain;
        targetChain = packet.destChain;
        if (bytes(packet.relayChain).length > 0) {
            targetChain = packet.relayChain;
        }
        IClient client = clientManager.getClient(targetChain);
        require(address(client) != address(0), "consensus state not found");

        uint64 nextSequenceSend = sequences[
            Host.nextSequenceSendKey(packet.sourceChain, packet.destChain)
        ];
        if (nextSequenceSend == 0) {
            nextSequenceSend = 1;
        }
        require(
            packet.sequence == nextSequenceSend,
            "packet sequence ≠ next send sequence"
        );
        bytes32 commitment = sha256(packet.data);
        nextSequenceSend++;
        sequences[
            Host.nextSequenceSendKey(packet.sourceChain, packet.destChain)
        ] = nextSequenceSend;
        commitments[
            Host.packetCommitmentKey(
                packet.sourceChain,
                packet.destChain,
                packet.sequence
            )
        ] = commitment;

        emit PacketSent(packet);
    }

    /**
     * @notice recvPacket is called by a module in order to receive & process an TIBC packet
     * @param packet tibc packet
     * @param proof proof commit
     * @param height proof height
     */
    function recvPacket(
        PacketTypes.Packet calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external override {
        require(
            packet.sequence >
                sequences[
                    Host.cleanPacketCommitmentKey(
                        packet.sourceChain,
                        packet.destChain
                    )
                ],
            "sequence illegal!"
        );

        require(
            !receipts[
                Host.packetReceiptKey(
                    packet.sourceChain,
                    packet.destChain,
                    packet.sequence
                )
            ],
            "packet has been received"
        );
        string memory targetChain;

        if (
            Strings.equals(packet.destChain, clientManager.getChainName()) &&
            bytes(packet.relayChain).length > 0
        ) {
            targetChain = packet.relayChain;
        } else {
            targetChain = packet.sourceChain;
        }

        IClient client = clientManager.getClient(targetChain);
        require(address(client) != address(0), "consensus state not found");
        commitBytes = Bytes.fromBytes32(sha256(packet.data));
        client.verifyPacketCommitment(
            height,
            proof,
            packet.sourceChain,
            packet.destChain,
            packet.sequence,
            commitBytes
        );

        receipts[
            Host.packetReceiptKey(
                packet.sourceChain,
                packet.destChain,
                packet.sequence
            )
        ] = true;

        if (Strings.equals(packet.destChain, clientManager.getChainName())) {
            IModule module = routing.getMoudle(packet.port);
            require(address(module) != address(0), "this module not found!");
            bytes memory ack = module.onRecvPacket(packet);
            PacketTypes.Packet memory packetCopy = PacketTypes.Packet(
                packet.sequence,
                packet.port,
                packet.sourceChain,
                packet.destChain,
                packet.relayChain,
                packet.data
            );
            if (ack.length > 0) {
                writeAcknowledgement(packetCopy, ack);
            }
        } else {
            require(
                routing.authenticate(
                    packet.sourceChain,
                    packet.destChain,
                    packet.port
                ),
                "no rule in routing table to relay this packet"
            );
            client = clientManager.getClient(packet.destChain);
            require(address(client) != address(0), "consensus state not found");
            commitments[
                Host.packetCommitmentKey(
                    packet.sourceChain,
                    packet.destChain,
                    packet.sequence
                )
            ] = sha256(packet.data);
            emit PacketSent(packet);
        }
    }

    /**
     * @notice writeAcknowledgement is called by a module in order to send back a ack message
     * @param packet tibc packet
     * @param acknowledgement return by modules
     */
    function writeAcknowledgement(
        PacketTypes.Packet memory packet,
        bytes memory acknowledgement
    ) internal {
        require(
            commitments[
                Host.packetAcknowledgementKey(
                    packet.sourceChain,
                    packet.destChain,
                    packet.sequence
                )
            ] == bytes32(0),
            "acknowledgement for packet already exists"
        );
        require(acknowledgement.length != 0, "acknowledgement cannot be empty");
        string memory targetChain = packet.sourceChain;
        if (bytes(packet.relayChain).length > 0) {
            targetChain = packet.relayChain;
        }
        IClient client = clientManager.getClient(targetChain);
        require(address(client) != address(0), "consensus state not found");

        commitments[
            Host.packetAcknowledgementKey(
                packet.sourceChain,
                packet.destChain,
                packet.sequence
            )
        ] = sha256(acknowledgement);
        emit AckWritten(packet, acknowledgement);
    }

    /**
     * @notice acknowledgePacket is called by relayer in order to receive an TIBC acknowledgement
     * @param packet tibc packet
     * @param acknowledgement acknowledgement from dest chain
     * @param proofAcked ack proof commit
     * @param height ack proof height
     */
    function acknowledgePacket(
        PacketTypes.Packet calldata packet,
        bytes calldata acknowledgement,
        bytes calldata proofAcked,
        Height.Data calldata height
    ) external override {
        require(
            commitments[
                Host.packetCommitmentKey(
                    packet.sourceChain,
                    packet.destChain,
                    packet.sequence
                )
            ] == sha256(packet.data),
            "commitment bytes are not equal!"
        );

        string memory targetChain;

        if (
            Strings.equals(packet.sourceChain, clientManager.getChainName()) &&
            bytes(packet.relayChain).length > 0
        ) {
            targetChain = packet.relayChain;
        } else {
            targetChain = packet.destChain;
        }

        require(
            address(clientManager.getClient(targetChain)) != address(0),
            "consensus state not found"
        );

        commitBytes = Bytes.fromBytes32(sha256(acknowledgement));
        clientManager.getClient(targetChain).verifyPacketAcknowledgement(
            height,
            proofAcked,
            packet.sourceChain,
            packet.destChain,
            packet.sequence,
            commitBytes
        );

        delete commitments[
            Host.packetCommitmentKey(
                packet.sourceChain,
                packet.destChain,
                packet.sequence
            )
        ];

        if (Strings.equals(packet.destChain, clientManager.getChainName())) {
            IModule module = routing.getMoudle(packet.port);
            module.onAcknowledgementPacket(packet, acknowledgement);
        } else {
            require(
                routing.authenticate(
                    packet.sourceChain,
                    packet.destChain,
                    packet.port
                ),
                "no rule in routing table to relay this packet"
            );

            require(
                address(clientManager.getClient(packet.sourceChain)) !=
                    address(0),
                "consensus state not found"
            );
            commitments[
                Host.packetAcknowledgementKey(
                    packet.sourceChain,
                    packet.destChain,
                    packet.sequence
                )
            ] = sha256(acknowledgement);
            emit AckWritten(packet, acknowledgement);
        }
    }

    /**
     * @notice cleanPacket is called in order to send an clean packet.
     * @param packet tibc clean packet
     */
    function cleanPacket(PacketTypes.CleanPacket calldata packet)
        external
        override
    {
        require(packet.sequence > 0, "sequence must be greater than 0");

        uint64 currentCleanSeq = sequences[
            Host.cleanPacketCommitmentKey(packet.sourceChain, packet.destChain)
        ];
        require(packet.sequence > currentCleanSeq, "sequence illegal!");

        for (uint64 i = currentCleanSeq; i <= packet.sequence; i++) {
            require(
                commitments[
                    Host.packetCommitmentKey(
                        packet.sourceChain,
                        packet.destChain,
                        i
                    )
                ].length == 0,
                "still have packet not been ack!"
            );
        }

        sequences[
            Host.cleanPacketCommitmentKey(packet.sourceChain, packet.destChain)
        ] = packet.sequence;
        for (uint64 i = currentCleanSeq; i <= packet.sequence; i++) {
            delete commitments[
                Host.packetAcknowledgementKey(
                    packet.sourceChain,
                    packet.destChain,
                    i
                )
            ];
            delete receipts[
                Host.packetReceiptKey(packet.sourceChain, packet.destChain, i)
            ];
        }
        emit CleanPacketSent(packet);
    }

    /**
     * @notice recvCleanPacket is called by relayer in order to receive & process an TIBC clean packet
     * @param packet tibc clean packet
     * @param proof proof commit
     * @param height proof height
     */
    function recvCleanPacket(
        PacketTypes.CleanPacket calldata packet,
        bytes calldata proof,
        Height.Data calldata height
    ) external override {
        uint64 currentCleanSeq = sequences[
            Host.cleanPacketCommitmentKey(packet.sourceChain, packet.destChain)
        ];
        require(packet.sequence > currentCleanSeq, "sequence illegal!");

        for (uint64 i = currentCleanSeq; i <= packet.sequence; i++) {
            require(
                commitments[
                    Host.packetCommitmentKey(
                        packet.sourceChain,
                        packet.destChain,
                        i
                    )
                ].length == 0,
                "still have packet not been ack!"
            );
        }

        string memory targetChain;

        if (Strings.equals(packet.destChain, clientManager.getChainName())) {
            if (bytes(packet.relayChain).length > 0) {
                targetChain = packet.relayChain;
            } else {
                targetChain = packet.sourceChain;
            }
        } else {
            targetChain = packet.sourceChain;
        }

        IClient client = clientManager.getClient(targetChain);
        require(address(client) != address(0), "consensus state not found");
        client.verifyPacketCleanCommitment(
            height,
            proof,
            packet.sourceChain,
            packet.destChain,
            packet.sequence
        );

        for (uint64 i = currentCleanSeq; i <= packet.sequence; i++) {
            delete commitments[
                Host.packetAcknowledgementKey(
                    packet.sourceChain,
                    packet.destChain,
                    i
                )
            ];
            delete receipts[
                Host.packetReceiptKey(packet.sourceChain, packet.destChain, i)
            ];
        }

        if (!Strings.equals(packet.destChain, clientManager.getChainName())) {
            client = clientManager.getClient(packet.destChain);
            require(address(client) != address(0), "consensus state not found");
            sequences[
                Host.cleanPacketCommitmentKey(
                    packet.sourceChain,
                    packet.destChain
                )
            ] = packet.sequence;
            emit CleanPacketSent(packet);
        }
    }

    /**
     * @notice Get packet next sequence to send
     * @param sourceChain name of source chain
     * @param destChain name of destination chain
     */
    function getNextSequenceSend(
        string memory sourceChain,
        string memory destChain
    ) public view override returns (uint64) {
        uint64 seq = sequences[
            Host.nextSequenceSendKey(sourceChain, destChain)
        ];
        if (seq == 0) {
            seq = 1;
        }
        return seq;
    }

    /**
     * @notice Set client manager contract
     * @param clientMgrContract contract address
     */
    function setClientManager(address clientMgrContract) external onlyOwner {
        clientManager = IClientManager(clientMgrContract);
    }

    /**
     * @notice Set routing contract
     * @param routingContract contract address
     */
    function setRouting(address routingContract) external onlyOwner {
        routing = IRouting(routingContract);
    }
}
