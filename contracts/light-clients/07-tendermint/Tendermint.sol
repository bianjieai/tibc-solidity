// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClient.sol";
import "../../interfaces/IClientManager.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/07-tendermint/Tendermint.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract Tendermint is IClient, Ownable, ReentrancyGuard {
    string public constant clientType = "tendermint";

    Types.ClientState public clientState;
    mapping(uint64 => Types.ConsensusState) public consensusStates;

    IClientManager public clientManager;

    constructor(address mgrAddr) {
        transferOwnership(mgrAddr);
        clientManager = IClientManager(mgrAddr);
    }

    function getLatestHeight()
        external
        view
        override
        returns (ClientTypes.Height memory)
    {
        return clientState.latestHeight;
    }

    function status() external view override returns (int8) {}

    function initialize(
        bytes calldata clientState,
        bytes calldata consensusState
    ) external override onlyOwner {}

    function upgrade(bytes calldata clientState, bytes calldata consensusState)
        external
        override
        onlyOwner
    {}

    function checkHeaderAndUpdateState(bytes calldata header)
        external
        override
        onlyOwner
    {}

    function verifyPacketCommitment(
        ClientTypes.Height calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata commitmentBytes
    ) external override {}

    function verifyPacketAcknowledgement(
        ClientTypes.Height calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata acknowledgement
    ) external override {}

    function verifyPacketCleanCommitment(
        ClientTypes.Height calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence
    ) external override {}
}
