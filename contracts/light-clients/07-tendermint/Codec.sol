// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../proto/Tendermint.sol";
import "../../proto/Commitment.sol";

library ClientStateCodec {
    /**
     * @notice dncodes the client state into ClientState
     * @param state ClientState
     * @param clientStateBz the client state bytes
     */
    function decode(ClientState.Data storage state, bytes memory clientStateBz)
        public
    {
        ClientState.decode(state, clientStateBz);
    }
}

library ConsensusStateCodec {
    /**
     * @notice dncodes the client state into ConsensusState
     * @param consensusStateBz the consensus state bytes
     */
    function decode(bytes memory consensusStateBz)
        public
        pure
        returns (ConsensusState.Data memory)
    {
        return ConsensusState.decode(consensusStateBz);
    }
}

library HeaderCodec {
    /**
     * @notice dncodes the header bytes into Header
     * @param headerBz the header bytes
     */
    function decode(bytes memory headerBz)
        public
        pure
        returns (Header.Data memory)
    {
        return Header.decode(headerBz);
    }
}

library ProofCodec {
    /**
     * @notice dncodes the proof bytes into MerkleProof
     * @param proofBz the merkleProof bytes
     */
    function decode(bytes memory proofBz)
        public
        pure
        returns (MerkleProof.Data memory)
    {
        return MerkleProof.decode(proofBz);
    }
}
