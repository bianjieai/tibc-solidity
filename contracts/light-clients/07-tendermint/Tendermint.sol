// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClient.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/07-tendermint/Tendermint.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract Tendermint is IClient, Ownable, ReentrancyGuard {
    string private constant ClientType = "tendermint";

    Types.ClientState public clientState;
    mapping(uint64 => Types.ConsensusState) public consensusStates;

    constructor(address mgrAddr) {
        transferOwnership(mgrAddr);
    }

    function clientType() external pure override returns (string memory) {
        return ClientType;
    }

    function getLatestHeight()
        external
        view
        override
        returns (ClientTypes.Height memory)
    {}

    function validate() external view override returns (bool) {}

    function getDelayTime() external view override returns (uint64) {}

    function getDelayBlock() external view override returns (uint64) {}

    function getPrefix() external view override returns (uint64) {}

    function initialize(
        bytes calldata clientState,
        bytes calldata consensusState
    ) external override {}

    function status() external view override returns (int8) {}

    function checkHeaderAndUpdateState(bytes calldata header)
        external
        override
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
