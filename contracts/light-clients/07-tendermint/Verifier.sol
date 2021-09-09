// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../libraries/23-commitment/Merkle.sol";
import "../../libraries/24-host/Host.sol";
import "../../proto/Tendermint.sol";
import "../../proto/Commitment.sol";
import "../../proto/Proofs.sol";

contract Verifier {
    // current light client status
    bytes private clientState;
    // consensus status of light clients
    mapping(uint256 => bytes) private consensusStates;
    //System time each time the client status is updated
    mapping(uint256 => uint256) private processedTime;

    function setProcessedTime(uint256 height) internal {
        processedTime[height] = now;
    }

    function getClientState() internal view returns (ClientState.Data memory) {
        return ClientState.decode(clientState);
    }

    function setClientState(ClientState.Data memory _clientState) internal {
        clientState = ClientState.encode(_clientState);
    }

    function setClientState(bytes memory _clientState) internal {
        clientState = _clientState;
    }

    function getConsensusState(uint256 height)
        internal
        view
        returns (ConsensusState.Data memory)
    {
        return ConsensusState.decode(consensusStates[height]);
    }

    function setConsensusState(
        uint256 height,
        ConsensusState.Data memory _consensusState
    ) internal {
        consensusStates[height] = ConsensusState.encode(_consensusState);
    }

    function setConsensusState(uint256 height, bytes memory _consensusState)
        internal
    {
        consensusStates[height] = _consensusState;
    }

    /* @notice                  this function is called by the relayer, the purpose is to use the current state of the light client to verify cross-chain data packets
     *
     *  @param height           the height of cross-chain data packet proof
     *  @param proof            proof of the existence of cross-chain data packets
     *  @param sourceChain      the original chain of the cross-chain data package
     *  @param destChain        the destination chain of the cross-chain data packet
     *  @param sequence         the sequence of cross-chain data packets
     *  @param commitmentBytes  the hash of the cross-chain data packet
     */
    function verifyCommitment(
        Height.Data memory height,
        bytes memory proof,
        string memory sourceChain,
        string memory destChain,
        uint64 sequence,
        bytes memory commitmentBytes
    ) internal view {
        ClientState.Data memory state = ClientState.decode(clientState);
        require(
            processedTime[height.revision_height] + state.time_delay <= now,
            "processedTime + time_delay should be greater than current time"
        );
        ConsensusState.Data memory cs = ConsensusState.decode(
            consensusStates[height.revision_height]
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.packetCommitmentPath(sourceChain, destChain, sequence);
        Merkle.verifyMembership(
            MerkleProof.decode(proof),
            state.proof_specs,
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            commitmentBytes
        );
    }

    /* @notice                  this function is called by the relayer, the purpose is to use the current state of the light client to verify the acknowledgement of cross-chain data packets
     *
     *  @param height           the height of cross-chain data packet proof
     *  @param proof            proof of the existence of cross-chain data packets
     *  @param sourceChain      the original chain of the cross-chain data package
     *  @param destChain        the destination chain of the cross-chain data packet
     *  @param sequence         the sequence of cross-chain data packets
     *  @param acknowledgement  the hash of the acknowledgement of the cross-chain data packet
     */
    function verifyAcknowledgement(
        Height.Data memory height,
        bytes memory proof,
        string memory sourceChain,
        string memory destChain,
        uint64 sequence,
        bytes memory acknowledgement
    ) internal view {
        ClientState.Data memory state = ClientState.decode(clientState);
        require(
            processedTime[height.revision_height] + state.time_delay <= now,
            "processedTime + time_delay should be greater than current time"
        );
        ConsensusState.Data memory cs = ConsensusState.decode(
            consensusStates[height.revision_height]
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.packetAcknowledgementPath(
            sourceChain,
            destChain,
            sequence
        );
        Merkle.verifyMembership(
            MerkleProof.decode(proof),
            state.proof_specs,
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            acknowledgement
        );
    }

    /* @notice                  this function is called by the relayer, the purpose is to use the current state of the light client to verify the cross-chain data packets
     *
     *  @param height           the height of cross-chain data packet proof
     *  @param proof            proof of the existence of cross-chain data packets
     *  @param sourceChain      the original chain of the cross-chain data package
     *  @param destChain        the destination chain of the cross-chain data packet
     *  @param sequence         the sequence of cross-chain data packets
     */
    function verifyCleanCommitment(
        Height.Data memory height,
        bytes memory proof,
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    ) internal view {
        ClientState.Data memory state = ClientState.decode(clientState);
        require(
            processedTime[height.revision_height] + state.time_delay <= now,
            "processedTime + time_delay should be greater than current time"
        );
        ConsensusState.Data memory cs = ConsensusState.decode(
            consensusStates[height.revision_height]
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.cleanPacketCommitmentPath(sourceChain, destChain);
        Merkle.verifyMembership(
            MerkleProof.decode(proof),
            state.proof_specs,
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            Bytes.uint64ToBigEndian(sequence)
        );
    }
}
