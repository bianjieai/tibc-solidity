// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../proto/Tendermint.sol";
import "../../proto/Commitment.sol";

library ClientStateCodec {
    function decode(bytes memory clientStateBz)
        public
        pure
        returns (ClientState.Data memory)
    {
        return ClientState.decode(clientStateBz);
    }

    function decode(ClientState.Data storage state, bytes memory clientStateBz)
        public
    {
        ClientState.decode(state, clientStateBz);
    }
}

library ConsensusStateCodec {
    function decode(bytes memory consensusStateBz)
        public
        pure
        returns (ConsensusState.Data memory)
    {
        return ConsensusState.decode(consensusStateBz);
    }
}

library HeaderCodec {
    function decode(bytes memory headerBz)
        public
        pure
        returns (Header.Data memory)
    {
        return Header.decode(headerBz);
    }
}

library ProofCodec {
    function decode(bytes memory proofBz)
        public
        pure
        returns (MerkleProof.Data memory)
    {
        return MerkleProof.decode(proofBz);
    }
}
