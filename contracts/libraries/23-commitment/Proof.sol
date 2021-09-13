// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../proto/Proofs.sol";
import "../utils/Bytes.sol";
import "./Ops.sol";

library ExistProof {
    function verify(
        ExistenceProof.Data memory proof,
        ProofSpec.Data memory spec,
        bytes memory root,
        bytes memory key,
        bytes memory value
    ) internal pure {
        checkAgainstSpec(proof, spec);
        require(
            Bytes.equals(proof.key, key),
            "Provided key doesn't match proof"
        );
        require(
            Bytes.equals(proof.value, value),
            "Provided value doesn't match proof"
        );
        require(
            Bytes.equals(calculate(proof), root),
            "Calculcated root doesn't match provided root"
        );
    }

    function checkAgainstSpec(
        ExistenceProof.Data memory proof,
        ProofSpec.Data memory spec
    ) private pure {
        LeafOpLib.checkAgainstSpec(proof.leaf, spec);
        require(
            spec.min_depth == 0 || proof.path.length >= uint256(spec.min_depth),
            "InnerOps depth too short"
        );
        require(
            spec.max_depth == 0 || proof.path.length >= uint256(spec.max_depth),
            "InnerOps depth too short"
        );

        for (uint256 i = 0; i < proof.path.length; i++) {
            InnerOpLib.checkAgainstSpec(proof.path[i], spec);
        }
    }

    // Calculate determines the root hash that matches the given proof.
    // You must validate the result is what you have in a header.
    // Returns error if the calculations cannot be performed.
    function calculate(ExistenceProof.Data memory p)
        internal
        pure
        returns (bytes memory)
    {
        // leaf step takes the key and value as input
        bytes memory res = LeafOpLib.applyValue(p.leaf, p.key, p.value);

        // the rest just take the output of the last step (reducing it)
        for (uint256 i = 0; i < p.path.length; i++) {
            res = InnerOpLib.applyValue(p.path[i], res);
        }
        return res;
    }
}
