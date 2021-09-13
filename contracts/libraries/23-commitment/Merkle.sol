// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./Tics23.sol";
import "../utils/Bytes.sol";
import "../../proto/Proofs.sol";
import "../../proto/Commitment.sol";

library Merkle {
    // verifyMembership verifies the membership pf a merkle proof against the given root, path, and value
    function verifyMembership(
        MerkleProof.Data memory proof,
        ProofSpec.Data[] memory specs,
        MerkleRoot.Data memory root,
        MerklePath.Data memory path,
        bytes memory value
    ) internal pure {
        validateVerificationArgs(proof, specs, root);
        require(
            path.key_path.length == specs.length,
            "path.key_path.length != specs.length"
        );
        require(value.length > 0, "empty value in membership proof");
        verifyChainedMembershipProof(
            root.hash,
            specs,
            proof.proofs,
            path,
            value,
            0
        );
    }

    // verifyChainedMembershipProof takes a list of proofs and specs and verifies each proof sequentially ensuring that the value is committed to
    // by first proof and each subsequent subroot is committed to by the next subroot and checking that the final calculated root is equal to the given roothash.
    // The proofs and specs are passed in from lowest subtree to the highest subtree, but the keys are passed in from highest subtree to lowest.
    // The index specifies what index to start chaining the membership proofs, this is useful since the lowest proof may not be a membership proof, thus we
    // will want to start the membership proof chaining from index 1 with value being the lowest subroot
    function verifyChainedMembershipProof(
        bytes memory root,
        ProofSpec.Data[] memory specs,
        CommitmentProof.Data[] memory proofs,
        MerklePath.Data memory keys,
        bytes memory value,
        uint256 index
    ) private pure {
        // Initialize subroot to value since the proofs list may be empty.
        // This may happen if this call is verifying intermediate proofs after the lowest proof has been executed.
        // In this case, there may be no intermediate proofs to verify and we just check that lowest proof root equals final root
        bytes memory subroot = root;
        for (uint256 i = index; i < proofs.length; i++) {
            if (proofs[i].exist.key.length > 0) {
                subroot = CommitmentProofLib.calculate(proofs[i]);
                ICS23.verifyMembership(
                    specs[i],
                    subroot,
                    proofs[i],
                    getKey(keys, keys.key_path.length - 1 - i),
                    value
                );
                // Set value to subroot so that we verify next proof in chain commits to this subroot
                value = subroot;
            } else {
                revert(
                    "chained membership proof contains nonexistence proof. If this is unexpected, please ensure that proof was queried from the height that contained the value in store and was queried with the correct key."
                );
            }
        }
        // Check that chained proof root equals passed-in root
        require(
            Bytes.equals(subroot, root),
            "chained proof root does not match given root"
        );
    }

    function getKey(MerklePath.Data memory keys, uint256 i)
        private
        pure
        returns (bytes memory)
    {
        // TODO url.PathUnescape(keys.key_path[i])
        return bytes(keys.key_path[i]);
    }

    function validateVerificationArgs(
        MerkleProof.Data memory proof,
        ProofSpec.Data[] memory specs,
        MerkleRoot.Data memory root
    ) private pure {
        require(proof.proofs.length > 0, "proof cannot be empty");
        require(root.hash.length > 0, "root cannot be empty");
        require(
            proof.proofs.length == specs.length,
            "length of specs not equal to length of proof "
        );
        for (uint256 i = 0; i < specs.length; i++) {
            require(specs[i].inner_spec.child_order.length > 0, "spec invalid");
        }
    }
}
