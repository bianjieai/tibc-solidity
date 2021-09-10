// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../libraries/23-commitment/Merkle.sol";
import "../../libraries/24-host/Host.sol";
import "../../proto/Tendermint.sol";
import "../../proto/Proofs.sol";
import "./Codec.sol";

library Verifier {
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
        ClientState.Data storage state,
        ConsensusState.Data storage cs,
        uint256 lastProcessedTime,
        bytes memory proof,
        string memory sourceChain,
        string memory destChain,
        uint64 sequence,
        bytes memory commitmentBytes
    ) public view {
        require(
            lastProcessedTime + state.time_delay <= now,
            "processedTime + time_delay should be greater than current time"
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.packetCommitmentPath(sourceChain, destChain, sequence);
        Merkle.verifyMembership(
            ProofCodec.decode(proof),
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
        ClientState.Data storage state,
        ConsensusState.Data storage cs,
        uint256 lastProcessedTime,
        bytes memory proof,
        string memory sourceChain,
        string memory destChain,
        uint64 sequence,
        bytes memory acknowledgement
    ) public view {
        require(
            lastProcessedTime + state.time_delay <= now,
            "processedTime + time_delay should be greater than current time"
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.packetAcknowledgementPath(
            sourceChain,
            destChain,
            sequence
        );
        Merkle.verifyMembership(
            ProofCodec.decode(proof),
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
        ClientState.Data storage state,
        ConsensusState.Data storage cs,
        uint256 lastProcessedTime,
        bytes memory proof,
        string memory sourceChain,
        string memory destChain,
        uint64 sequence
    ) public view {
        require(
            lastProcessedTime + state.time_delay <= now,
            "processedTime + time_delay should be greater than current time"
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.cleanPacketCommitmentPath(sourceChain, destChain);
        Merkle.verifyMembership(
            ProofCodec.decode(proof),
            state.proof_specs,
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            Bytes.uint64ToBigEndian(sequence)
        );
    }
}
