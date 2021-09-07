// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../libraries/07-tendermint/MerkleTree.sol";
import "../libraries/23-commitment/Merkle.sol";
import "hardhat/console.sol";

contract TestMerkleTree {
    function hashFromByteSlices(bytes[] memory data)
        public
        pure
        returns (bytes32)
    {
        return MerkleTree.hashFromByteSlices(data);
    }

    function verifyMembership(
        bytes memory proofBz,
        bytes[] memory specsBz,
        bytes memory rootBz,
        bytes memory pathBz,
        bytes memory value
    ) public view {
        MerkleProof.Data memory proof = MerkleProof.decode(proofBz);
        console.logBytes(proof.proofs[0].exist.value);
        console.logBytes(value);
        ProofSpec.Data[] memory specs = new ProofSpec.Data[](specsBz.length);
        for (uint256 i = 0; i < specsBz.length; i++) {
            specs[i] = ProofSpec.decode(specsBz[i]);
        }
        MerkleRoot.Data memory root = MerkleRoot.decode(rootBz);
        MerklePath.Data memory path = MerklePath.decode(pathBz);
        Merkle.verifyMembership(proof, specs, root, path, value);
    }
}
