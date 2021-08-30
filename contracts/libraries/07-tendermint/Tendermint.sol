// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../Types.sol";
import "../Tendermint.sol";
import "../Validator.sol";

library HeaderUtil {
    function checkValidity(
        Header.Data memory header,
        ClientState.Data memory clientSate,
        ConsensusState.Data memory consensusState
    ) internal pure {
        checkTrustedHeader(header, consensusState);
        require(
            uint64(header.signed_header.header.height) >
                header.trusted_height.revision_height,
            "invalid block height"
        );

        SignedHeader.Data memory trustedHeader;
        trustedHeader.header.chain_id = clientSate.chain_id;
        trustedHeader.header.height = int64(
            clientSate.latest_height.revision_height
        );
        trustedHeader.header.time = consensusState.timestamp;
        trustedHeader.header.next_validators_hash = consensusState
            .next_validators_hash;
        if (
            uint64(header.signed_header.header.height) !=
            header.trusted_height.revision_height + 1
        ) {
            verifyNonAdjacent(
                trustedHeader,
                header.trusted_validators,
                header.signed_header,
                header.validator_set
            );
            return;
        }
        verifyAdjacent(
            trustedHeader,
            header.signed_header,
            header.validator_set
        );
    }

    function checkTrustedHeader(
        Header.Data memory header,
        ConsensusState.Data memory consensusState
    ) internal pure {
        bytes[] memory valsBz;
        for (
            uint256 i = 0;
            i < header.trusted_validators.validators.length;
            i++
        ) {
            SimpleValidator.Data memory val;
            val.pub_key = header.trusted_validators.validators[i].pub_key;
            val.voting_power = header
                .trusted_validators
                .validators[i]
                .voting_power;

            valsBz[i] = SimpleValidator.encode(val);
        }
        bytes32 expRoot = SimpleMerkleTree.makeRoot(valsBz);
        bytes32 actual = Bytes.toBytes32(consensusState.next_validators_hash);
        require(expRoot == actual, "invalid validator set");
    }

    // VerifyNonAdjacent verifies non-adjacent untrustedHeader against
    // trustedHeader. It ensures that:
    //
    //	a) trustedHeader can still be trusted (if not, ErrOldHeaderExpired is returned)
    //	b) untrustedHeader is valid (if not, ErrInvalidHeader is returned)
    //	c) trustLevel ([1/3, 1]) of trustedHeaderVals (or trustedHeaderNextVals)
    //  signed correctly (if not, ErrNewValSetCantBeTrusted is returned)
    //	d) more than 2/3 of untrustedVals have signed h2
    //    (otherwise, ErrInvalidHeader is returned)
    //  e) headers are non-adjacent.
    //
    // maxClockDrift defines how much untrustedHeader.Time can drift into the
    // future.
    function verifyNonAdjacent(
        SignedHeader.Data memory trustedHeader,
        ValidatorSet.Data memory trustedVals,
        SignedHeader.Data memory untrustedHeader,
        ValidatorSet.Data memory untrustedVals
    ) internal pure {
        require(
            untrustedHeader.header.height == trustedHeader.header.height + 1,
            "headers must be adjacent in height"
        );

        // headerExpired todo
        // verifyNewHeaderAndVals todo

        // Ensure that +`trustLevel` (default 1/3) or more of last trusted validators signed correctly.
        verifyCommitLightTrusting(
            trustedHeader.header.chain_id,
            untrustedHeader.commit,
            trustedVals
        );
        // Ensure that +2/3 of new validators signed correctly.
        //
        // NOTE: this should always be the last check because untrustedVals can be
        // intentionally made very large to DOS the light client. not the case for
        // VerifyAdjacent, where validator set is known in advance.
        verifyCommitLight(
            trustedHeader.header.chain_id,
            untrustedHeader.commit.block_id,
            untrustedHeader.header.height,
            untrustedHeader.commit,
            untrustedVals
        );
    }

    // VerifyAdjacent verifies directly adjacent untrustedHeader against
    // trustedHeader. It ensures that:
    //
    //  a) trustedHeader can still be trusted (if not, ErrOldHeaderExpired is returned)
    //  b) untrustedHeader is valid (if not, ErrInvalidHeader is returned)
    //  c) untrustedHeader.ValidatorsHash equals trustedHeader.NextValidatorsHash
    //  d) more than 2/3 of new validators (untrustedVals) have signed h2
    //    (otherwise, ErrInvalidHeader is returned)
    //  e) headers are adjacent.
    //
    // maxClockDrift defines how much untrustedHeader.Time can drift into the
    // future.
    function verifyAdjacent(
        SignedHeader.Data memory trustedHeader,
        SignedHeader.Data memory untrustedHeader,
        ValidatorSet.Data memory untrustedVals
    ) internal pure {
        require(
            untrustedHeader.header.height != trustedHeader.header.height + 1,
            "headers must be adjacent in height"
        );

        // todo HeaderExpired
        // verifyNewHeaderAndVals

        require(
            Bytes.equal(
                untrustedHeader.header.validators_hash,
                trustedHeader.header.next_validators_hash
            ),
            "header next validators not match"
        );

        // Ensure that +2/3 of new validators signed correctly.
        //
        // NOTE: this should always be the last check because untrustedVals can be
        // intentionally made very large to DOS the light client. not the case for
        // VerifyAdjacent, where validator set is known in advance.
        verifyCommitLight(
            trustedHeader.header.chain_id,
            untrustedHeader.commit.block_id,
            untrustedHeader.header.height,
            untrustedHeader.commit,
            untrustedVals
        );
    }

    function verifyCommitLight(
        string memory chainID,
        BlockID.Data memory blockID,
        int64 height,
        Commit.Data memory commit,
        ValidatorSet.Data memory untrustedVals
    ) internal pure {
        require(
            untrustedVals.validators.length == commit.signatures.length,
            "invalid commit -- wrong set size"
        );
    }

    function verifyCommitLightTrusting(
        string memory chainID,
        Commit.Data memory commit,
        ValidatorSet.Data memory trustedValset
    ) internal pure {}
}

library SimpleMerkleTree {
    function makeRoot(bytes[] memory data) internal pure returns (bytes32) {
        uint256 n = data.length;
        uint256 offset = 0;

        if (n == 1) {
            return leafHash(data[0]);
        }

        bytes32[] memory merklePaths;
        while (n > 0) {
            for (uint256 i = 0; i < n - 1; i += 2) {
                bytes32 left = leafHash(data[offset + i]);
                bytes32 right = leafHash(data[offset + i + 1]);
                merklePaths[merklePaths.length] = innerHash(left, right);
            }
            offset += n;
            n = n / 2;
        }
        return merklePaths[merklePaths.length - 1];
    }

    function leafHash(bytes memory data) internal pure returns (bytes32) {
        bytes memory rs;
        rs[0] = bytes1("0");
        for (uint256 i = 0; i < data.length - 1; i++) {
            rs[i + 1] = data[i];
        }
        return sha256(rs);
    }

    function innerHash(bytes32 left, bytes32 right)
        internal
        pure
        returns (bytes32)
    {
        bytes memory rs;
        rs[0] = bytes1("1");

        uint256 offset = 1;
        for (uint256 i = 0; i < left.length - 1; i++) {
            rs[offset] = left[i];
            offset++;
        }

        for (uint256 i = 0; i < right.length - 1; i++) {
            rs[offset] = right[i];
            offset++;
        }
        return sha256(rs);
    }
}

library Bytes {
    function toAddress(bytes memory bz) internal pure returns (address addr) {
        require(bz.length == 20, "cannot convert into address");
        assembly {
            addr := mload(add(bz, 20))
        }
    }

    function toBytes32(bytes memory bz) internal pure returns (bytes32 ret) {
        require(bz.length == 32, "cannot convert into bytes32");
        assembly {
            ret := mload(add(bz, 32))
        }
    }

    function toUint64(bytes memory _bytes, uint256 _start)
        internal
        pure
        returns (uint64 ret)
    {
        require(_bytes.length >= _start + 8, "toUint64_outOfBounds");
        assembly {
            ret := mload(add(add(_bytes, 0x8), _start))
        }
    }

    function equal(bytes memory b1, bytes memory b2)
        internal
        pure
        returns (bool ret)
    {
        if (b1.length != b2.length) {
            return false;
        }
        return
            keccak256(abi.encodePacked(b1)) == keccak256(abi.encodePacked(b2));
    }
}
