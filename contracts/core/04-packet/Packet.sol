// SPDX-License-Identifier: Apache-License
pragma solidity ^0.8.0;

import "../02-client/Client.sol";
import "../../interfaces/IClient.sol";
import "../../interfaces/IClientState.sol";
import "../../interfaces/IModule.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract Packet is ReentrancyGuard {
    address public CLIENTMANAGER;

    // port -> module app implementation address
    mapping(string => IModule) public modules;

    function sendPacket(
        uint64 sequence,
        string sourceChain,
        string destChain,
        string relayChain,
        bytes calldata data
    ) external override nonReentrant {}

    function recvPacket(
        uint64 sequence,
        string port,
        string sourceChain,
        string destChain,
        string relayChain,
        bytes calldata data,
        bytes calldata proof,
        uint64 revisionNumber,
        uint64 revisionHeight
    ) external override nonReentrant {
        IClientState clientState = IClient(CLIENTMANAGER).getClientState(
            sourceChain
        );
        clientState.verifyPacketCommitment(
            revisionNumber,
            revisionHeight,
            proof,
            sourceChain,
            destChain,
            sequence,
            data
        );
        IModule module = modules[port];
        module.onRecvPacket(
            sequence,
            port,
            sourceChain,
            destChain,
            relayChain,
            data
        );
    }

    function acknowledgePacket(
        uint64 sequence,
        string port,
        string sourceChain,
        string destChain,
        string relayChain,
        bytes calldata data,
        bytes calldata acknowledgement,
        bytes calldata proof,
        uint64 revisionNumber,
        uint64 revisionHeight
    ) external override nonReentrant {
        IClientState clientState = IClient(CLIENTMANAGER).getClientState(
            destChain
        );
        clientState.verifyPacketAcknowledgement(
            revisionNumber,
            revisionHeight,
            proof,
            sourceChain,
            destChain,
            sequence,
            acknowledgement
        );
        IModule module = modules[port];
        module.onAcknowledgementPacket(
            sequence,
            port,
            sourceChain,
            destChain,
            relayChain,
            data,
            acknowledgement
        );
    }

    function cleanPacket(
        uint64 sequence,
        string sourceChain,
        string destChain,
        string relayChain
    ) external override nonReentrant {}

    function recvCleanPacket(
        uint64 sequence,
        string sourceChain,
        string destChain,
        string relayChain,
        bytes calldata proof,
        uint64 revisionNumber,
        uint64 revisionHeight
    ) external override nonReentrant {}

    function writeAcknowledgement(
        uint64 sequence,
        string port,
        string sourceChain,
        string destChain,
        string relayChain,
        bytes calldata data
    ) internal override nonReentrant {}
}
