// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./Proof.sol";
import "./Compress.sol";
import "../../proto/Proofs.sol";
import "../../proto/Commitment.sol";

library ics23 {
    using ExistProof for ExistenceProof.Data;

    function verifyMembership(
        ProofSpec.Data memory spec,
        bytes memory root,
        CommitmentProof.Data memory proof,
        bytes memory key,
        bytes memory value
    ) internal pure {
        // decompress it before running code (no-op if not compressed)
        proof = Compress.decompress(proof);
        ExistenceProof.Data memory ep = getExistProofForKey(proof, key);
        require(ep.key.length > 0, "key is empty");
        ep.verify(spec, root, key, value);
    }

    function getExistProofForKey(
        CommitmentProof.Data memory proof,
        bytes memory key
    ) internal pure returns (ExistenceProof.Data memory) {
        if (proof.exist.key.length > 0) {
            return proof.exist;
        }
        if (proof.batch.entries.length > 0) {
            for (uint256 i = 0; i < proof.batch.entries.length; i++) {
                if (Bytes.equal(proof.batch.entries[i].exist.key, key)) {
                    return proof.batch.entries[i].exist;
                }
            }
        }
    }
}

library CommitmentProofLib {
    function calculate(CommitmentProof.Data memory p)
        internal
        pure
        returns (bytes memory)
    {
        if (p.exist.key.length > 0) {
            return ExistProof.calculate(p.exist);
        }
        if (p.batch.entries.length > 0) {
            if (p.batch.entries[0].exist.key.length > 0) {
                return ExistProof.calculate(p.batch.entries[0].exist);
            }
            if (p.batch.entries[0].nonexist.key.length > 0) {
                revert("not implement NonExistenceProof");
            }
        }
        if (p.compressed.lookup_inners.length > 0) {
            return calculate(Compress.decompress(p));
        }
    }
}
