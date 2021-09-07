// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./Proof.sol";
import "./Compress.sol";
import "../../proto/Proofs.sol";
import "../../proto/Commitment.sol";

library ICS23 {
    using ExistProof for ExistenceProof.Data;

    /** @notice verifyMembership verifies the membership pf a merkle proof against the given root, path, and value.
     * @param spec merkle root calculation rules
     * @param root the root of the merkle tree
     * @param proof the merkle proof of the value
     * @param key the merkle path of the value
     * @param value the node value of the merkle tree
     */
    function verifyMembership(
        ProofSpec.Data memory spec,
        bytes memory root,
        CommitmentProof.Data memory proof,
        bytes memory key,
        bytes memory value
    ) internal pure {
        // decompress it before running code (no-op if not compressed)
        ExistenceProof.Data memory ep = getExistProofForKey(
            Compress.decompress(proof),
            key
        );
        require(ep.key.length > 0, "key is empty");
        ep.verify(spec, root, key, value);
    }

    function getExistProofForKey(
        CommitmentProof.Data memory proof,
        bytes memory key
    ) private pure returns (ExistenceProof.Data memory) {
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
        revert("key not found");
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
