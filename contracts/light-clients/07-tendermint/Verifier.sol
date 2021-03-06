// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../libraries/23-commitment/Merkle.sol";
import "../../libraries/24-host/Host.sol";
import "../../proto/Tendermint.sol";
import "../../proto/Proofs.sol";
import "./Codec.sol";

library Verifier {
    /**
     * @notice this function is called by the packet contract, the purpose is to use the current state of the light client to verify cross-chain data packets
     * @param state the client state
     * @param cs the consensus state
     * @param lastProcessedTime the last time the client processed the cross-chain packets
     * @param proof proof of the existence of cross-chain data packets
     * @param sourceChain the source chain of the cross-chain data package
     * @param destChain the destination chain of the cross-chain data packet
     * @param sequence the sequence of cross-chain data packets
     * @param commitmentBytes the hash of the cross-chain data packet
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
            lastProcessedTime + state.time_delay <= block.timestamp,
            "processedTime + time_delay should be less than current time"
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.packetCommitmentPath(sourceChain, destChain, sequence);

        Merkle.verifyMembership(
            ProofCodec.decode(proof),
            getDefaultProofSpecs(state.proof_specs),
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            commitmentBytes
        );
    }

    /**
     * @notice this function is called by the packet contract, the purpose is to use the current state of the light client to verify cross-chain data packets
     * @param state the client state
     * @param cs the consensus state
     * @param lastProcessedTime the last time the client processed the cross-chain packets
     * @param proof proof of the existence of cross-chain data packets
     * @param sourceChain the source chain of the cross-chain data package
     * @param destChain the destination chain of the cross-chain data packet
     * @param sequence the sequence of cross-chain data packets
     * @param acknowledgement the hash of the cross-chain confirmation packet
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
            lastProcessedTime + state.time_delay <= block.timestamp,
            "processedTime + time_delay should be less than current time"
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
            getDefaultProofSpecs(state.proof_specs),
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            acknowledgement
        );
    }

    /**
     * @notice this function is called by the packet contract, the purpose is to use the current state of the light client to verify cross-chain data packets
     * @param state the client state
     * @param cs the consensus state
     * @param lastProcessedTime the last time the client processed the cross-chain packets
     * @param proof proof of the existence of cross-chain data packets
     * @param sourceChain the source chain of the cross-chain data package
     * @param destChain the destination chain of the cross-chain data packet
     * @param sequence the sequence of cross-chain data packets
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
            lastProcessedTime + state.time_delay <= block.timestamp,
            "processedTime + time_delay should be less than current time"
        );
        string[] memory path = new string[](2);
        path[0] = string(state.merkle_prefix.key_prefix);
        path[1] = Host.cleanPacketCommitmentPath(sourceChain, destChain);
        Merkle.verifyMembership(
            ProofCodec.decode(proof),
            getDefaultProofSpecs(state.proof_specs),
            MerkleRoot.Data(cs.root),
            MerklePath.Data(path),
            Bytes.uint64ToBigEndian(sequence)
        );
    }

    function getDefaultProofSpecs(ProofSpec.Data[] storage specs)
        internal
        view
        returns (ProofSpec.Data[] memory)
    {
        if (specs.length > 0) {
            return specs;
        }

        ProofSpec.Data[] memory defaultSpecs = new ProofSpec.Data[](2);
        ProofSpec.Data memory iavlSpec;
        ProofSpec.Data memory tmSpec;

        int32[] memory childOrder = new int32[](2);
        childOrder[0] = 0;
        childOrder[1] = 1;

        iavlSpec.leaf_spec = LeafOp.Data(
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256,
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.NO_HASH,
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256,
            PROOFS_PROTO_GLOBAL_ENUMS.LengthOp.VAR_PROTO,
            hex"00"
        );

        iavlSpec.inner_spec = InnerSpec.Data(
            childOrder,
            33,
            4,
            12,
            "",
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256
        );
        defaultSpecs[0] = iavlSpec;

        tmSpec.leaf_spec = LeafOp.Data(
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256,
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.NO_HASH,
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256,
            PROOFS_PROTO_GLOBAL_ENUMS.LengthOp.VAR_PROTO,
            hex"00"
        );

        tmSpec.inner_spec = InnerSpec.Data(
            childOrder,
            33,
            1,
            1,
            "",
            PROOFS_PROTO_GLOBAL_ENUMS.HashOp.SHA256
        );
        defaultSpecs[1] = tmSpec;
        return defaultSpecs;
    }
}
