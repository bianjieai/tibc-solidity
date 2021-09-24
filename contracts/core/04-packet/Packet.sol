// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../02-client/ClientManager.sol";
import "../../proto/Types.sol";
import "../../proto/Ack.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/04-packet/Packet.sol";
import "../../libraries/24-host/Host.sol";
import "../../libraries/utils/Bytes.sol";
import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "../../interfaces/IModule.sol";
import "../../interfaces/IPacket.sol";
import "../../interfaces/IRouting.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Packet is Ownable, IPacket {
    IClientManager public clientManager;
    IRouting public routing;

    mapping(bytes => uint64) public sequences;
    mapping(bytes => bytes32) public commitments;
    mapping(bytes => bool) public receipts;
    bytes public commitBytes;

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
    modifier validateBasic(uint64 sequence, bytes memory data, string memory port) {
        require(sequence > 0, "packet sequence cannot be 0");
        require(data.length > 0, "packet data bytes cannot be empty");
        require(address(routing.getModule(port)) == _msgSender(), "module has not been registered to routing contract");
        _;
    }

    /**
     * @notice SendPacket is called by a module in order to send an TIBC packet.
     * @param packet tibc packet
     */
    function sendPacket(PacketTypes.Packet calldata packet)
        external
        override
        validateBasic(packet.sequence, packet.data, packet.port)
    {
        string memory sentChain;
        sentChain = packet.destChain;
        if (bytes(packet.relayChain).length > 0) {
            sentChain = packet.relayChain;
        }
        IClient client = clientManager.getClient(sentChain);
        require(address(client) != address(0), "light client not found");

        bytes memory nextSequenceSendKey = Host.nextSequenceSendKey(
            packet.sourceChain,
            packet.destChain
        );
        if (sequences[nextSequenceSendKey] == 0) {
            sequences[nextSequenceSendKey] = 1;
        }
        require(
            packet.sequence == sequences[nextSequenceSendKey],
            "packet sequence ≠ next send sequence"
        );
        sequences[nextSequenceSendKey]++;
        commitments[
            Host.packetCommitmentKey(
                packet.sourceChain,
                packet.destChain,
                packet.sequence
            )
        ] = sha256(packet.data);

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
        if (
            packet.sequence <=
            sequences[
                Host.cleanPacketCommitmentKey(
                    packet.sourceChain,
                    packet.destChain
                )
            ]
        ) {
            writeAcknowledgement(
                PacketTypes.Packet(
                    packet.sequence,
                    packet.port,
                    packet.sourceChain,
                    packet.destChain,
                    packet.relayChain,
                    packet.data
                ),
                _newErrAcknowledgement("sequence illegal!")
            );
            revert("sequence illegal!");
        }

        bytes memory packetReceiptKey = Host.packetReceiptKey(
            packet.sourceChain,
            packet.destChain,
            packet.sequence
        );
        if (receipts[packetReceiptKey]) {
            writeAcknowledgement(
                PacketTypes.Packet(
                    packet.sequence,
                    packet.port,
                    packet.sourceChain,
                    packet.destChain,
                    packet.relayChain,
                    packet.data
                ),
                _newErrAcknowledgement("packet has been received!")
            );
            revert("packet has been received!");
        }
        string memory sentChain;

        if (
            Strings.equals(packet.destChain, clientManager.getChainName()) &&
            bytes(packet.relayChain).length > 0
        ) {
            sentChain = packet.relayChain;
        } else {
            sentChain = packet.sourceChain;
        }

        IClient client = clientManager.getClient(sentChain);
        if (address(client) == address(0)) {
            writeAcknowledgement(
                PacketTypes.Packet(
                    packet.sequence,
                    packet.port,
                    packet.sourceChain,
                    packet.destChain,
                    packet.relayChain,
                    packet.data
                ),
                _newErrAcknowledgement("light client not found!")
            );
            revert("light client not found!");
        }

        commitBytes = Bytes.fromBytes32(sha256(packet.data));
        try
            client.verifyPacketCommitment(
                height,
                proof,
                packet.sourceChain,
                packet.destChain,
                packet.sequence,
                commitBytes
            )
        {} catch {
            writeAcknowledgement(
                PacketTypes.Packet(
                    packet.sequence,
                    packet.port,
                    packet.sourceChain,
                    packet.destChain,
                    packet.relayChain,
                    packet.data
                ),
                _newErrAcknowledgement("packet verify failed!")
            );
            revert("packet verify failed!");
        }

        receipts[packetReceiptKey] = true;

        if (Strings.equals(packet.destChain, clientManager.getChainName())) {
            IModule module = routing.getModule(packet.port);
            if (address(module) == address(0)) {
                writeAcknowledgement(
                    PacketTypes.Packet(
                        packet.sequence,
                        packet.port,
                        packet.sourceChain,
                        packet.destChain,
                        packet.relayChain,
                        packet.data
                    ),
                    _newErrAcknowledgement("this module not found!")
                );
                revert("this module not found!");
            }
            bytes memory ack = module.onRecvPacket(packet);
            if (ack.length > 0) {
                writeAcknowledgement(
                    PacketTypes.Packet(
                        packet.sequence,
                        packet.port,
                        packet.sourceChain,
                        packet.destChain,
                        packet.relayChain,
                        packet.data
                    ),
                    ack
                );
            }
        } else {
            if (
                !routing.authenticate(
                    packet.sourceChain,
                    packet.destChain,
                    packet.port
                )
            ) {
                writeAcknowledgement(
                    PacketTypes.Packet(
                        packet.sequence,
                        packet.port,
                        packet.sourceChain,
                        packet.destChain,
                        packet.relayChain,
                        packet.data
                    ),
                    _newErrAcknowledgement(
                        "no rule in routing table to relay this packet"
                    )
                );
                revert("no rule in routing table to relay this packet");
            }
            client = clientManager.getClient(packet.destChain);
            if (address(client) == address(0)) {
                writeAcknowledgement(
                    PacketTypes.Packet(
                        packet.sequence,
                        packet.port,
                        packet.sourceChain,
                        packet.destChain,
                        packet.relayChain,
                        packet.data
                    ),
                    _newErrAcknowledgement("light client not found")
                );
                revert("light client not found");
            }
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
        string memory sentChain = packet.sourceChain;
        if (bytes(packet.relayChain).length > 0) {
            sentChain = packet.relayChain;
        }
        IClient client = clientManager.getClient(sentChain);
        require(address(client) != address(0), "light client not found");

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

        string memory sentChain;

        if (
            Strings.equals(packet.sourceChain, clientManager.getChainName()) &&
            bytes(packet.relayChain).length > 0
        ) {
            sentChain = packet.relayChain;
        } else {
            sentChain = packet.destChain;
        }

        require(
            address(clientManager.getClient(sentChain)) != address(0),
            "light client not found"
        );

        commitBytes = Bytes.fromBytes32(sha256(acknowledgement));
        clientManager.getClient(sentChain).verifyPacketAcknowledgement(
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
            IModule module = routing.getModule(packet.port);
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
                "light client not found"
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

        string memory sentChain;

        if (Strings.equals(packet.destChain, clientManager.getChainName())) {
            if (bytes(packet.relayChain).length > 0) {
                sentChain = packet.relayChain;
            } else {
                sentChain = packet.sourceChain;
            }
        } else {
            sentChain = packet.sourceChain;
        }

        IClient client = clientManager.getClient(sentChain);
        require(address(client) != address(0), "light client not found");
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

        sequences[
            Host.cleanPacketCommitmentKey(packet.sourceChain, packet.destChain)
        ] = packet.sequence;

        if (!Strings.equals(packet.destChain, clientManager.getChainName())) {
            client = clientManager.getClient(packet.destChain);
            require(address(client) != address(0), "light client not found");
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

    /**
     * @notice this function is to create error acks
     * @param errMsg error message
     */
    function _newErrAcknowledgement(string memory errMsg)
        internal
        pure
        virtual
        returns (bytes memory)
    {
        Acknowledgement.Data memory ack;
        ack.error = errMsg;
        return Acknowledgement.encode(ack);
    }
}
