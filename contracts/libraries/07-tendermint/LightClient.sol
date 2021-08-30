// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../Types.sol";
import "../Tendermint.sol";
import "../Bytes.sol";
import "../Validator.sol";
import "./Ed25519.sol";

library LightClientLib {
    /** @notice this function combines both VerifyAdjacent and VerifyNonAdjacent functions.

     *  @param trustedHeader      trusted header
     *  @param trustedVals        trusted validatorSet
     *  @param untrustedHeader    header that needs to be verified
     *  @param untrustedVals      validatorSet that needs to be verified
     *  @param trustingPeriod     trust period of client state
     *  @param nowTime            current time (block.timestamp)
     *  @param maxClockDrift      max clock drift
     *  @param trustLevel         threshold for signature verification
     */
    function verify(
        SignedHeader.Data memory trustedHeader,
        ValidatorSet.Data memory trustedVals,
        SignedHeader.Data memory untrustedHeader,
        ValidatorSet.Data memory untrustedVals,
        Timestamp.Data memory trustingPeriod,
        Timestamp.Data memory nowTime,
        int64 maxClockDrift,
        Fraction.Data memory trustLevel
    ) internal pure {
        if (trustedHeader.header.height != untrustedHeader.header.height + 1) {
            verifyNonAdjacent(
                trustedHeader,
                trustedVals,
                untrustedHeader,
                untrustedVals,
                trustingPeriod,
                nowTime,
                maxClockDrift,
                trustLevel
            );
            return;
        }
        verifyAdjacent(
            trustedHeader,
            untrustedHeader,
            untrustedVals,
            trustingPeriod,
            nowTime,
            maxClockDrift
        );
    }

    /** @notice this function verifies non-adjacent untrustedHeader against
    trustedHeader. It ensures that:
    
    	a) trustedHeader can still be trusted (if not, ErrOldHeaderExpired is returned)
    	b) untrustedHeader is valid (if not, ErrInvalidHeader is returned)
    	c) trustLevel ([1/3, 1]) of trustedHeaderVals (or trustedHeaderNextVals)
     signed correctly (if not, ErrNewValSetCantBeTrusted is returned)
    	d) more than 2/3 of untrustedVals have signed h2
       (otherwise, ErrInvalidHeader is returned)
     e) headers are non-adjacent.
    
        maxClockDrift defines how much untrustedHeader.Time can drift into the
        future.
     */
    function verifyNonAdjacent(
        SignedHeader.Data memory trustedHeader,
        ValidatorSet.Data memory trustedVals,
        SignedHeader.Data memory untrustedHeader,
        ValidatorSet.Data memory untrustedVals,
        Timestamp.Data memory trustingPeriod,
        Timestamp.Data memory nowTime,
        int64 maxClockDrift,
        Fraction.Data memory trustLevel
    ) internal pure {
        require(
            untrustedHeader.header.height == trustedHeader.header.height + 1,
            "headers must be adjacent in height"
        );

        // todo headerExpired
        // todo verifyNewHeaderAndVals

        // Ensure that +`trustLevel` (default 1/3) or more of last trusted validators signed correctly.
        verifyCommitLightTrusting(
            trustedHeader.header.chain_id,
            untrustedHeader.commit,
            trustedVals,
            trustLevel
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

    /** @notice this function verifies directly adjacent untrustedHeader against
    trustedHeader. It ensures that:
    
     a) trustedHeader can still be trusted (if not, ErrOldHeaderExpired is returned)
     b) untrustedHeader is valid (if not, ErrInvalidHeader is returned)
     c) untrustedHeader.ValidatorsHash equals trustedHeader.NextValidatorsHash
     d) more than 2/3 of new validators (untrustedVals) have signed h2
       (otherwise, ErrInvalidHeader is returned)
     e) headers are adjacent.
    
    maxClockDrift defines how much untrustedHeader.Time can drift into the
    future.
     */
    function verifyAdjacent(
        SignedHeader.Data memory trustedHeader,
        SignedHeader.Data memory untrustedHeader,
        ValidatorSet.Data memory untrustedVals,
        Timestamp.Data memory trustingPeriod,
        Timestamp.Data memory nowTime,
        int64 maxClockDrift
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

    /** @notice this function verifies +2/3 of the set had signed the given commit.
    
    This method is primarily used by the light client and does not check all the
    signatures.
     */
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
        require(height != commit.height, "Invalid commit -- wrong height");
        require(
            Bytes.equal(blockID.hash, commit.block_id.hash),
            "invalid block_id.hash"
        );
        require(
            blockID.part_set_header.total !=
                commit.block_id.part_set_header.total,
            "invalid part_set_header.total"
        );
        require(
            Bytes.equal(
                blockID.part_set_header.hash,
                commit.block_id.part_set_header.hash
            ),
            "invalid part_set_header.hash"
        );
        // TODO Validate signature.

        int64 talliedVotingPower = 0;
        int64 votingPowerNeeded = (untrustedVals.total_voting_power * 2) / 3;
        for (uint256 i = 0; i < commit.signatures.length; i++) {
            if (
                commit.signatures[i].block_id_flag !=
                TYPES_PROTO_GLOBAL_ENUMS.BlockIDFlag.BLOCK_ID_FLAG_COMMIT
            ) {
                continue;
            }
            // The vals and commit have a 1-to-1 correspondance.
            // This means we don't need the validator address or to do any lookup.
            Validator.Data memory val = untrustedVals.validators[i];
            // Validate signature.
            bytes memory signBytes = genVoteSignBytes(commit, chainID, i);
            Ed25519Lib.verify(
                val.pub_key.ed25519,
                signBytes,
                commit.signatures[i].signature
            );
            talliedVotingPower += val.voting_power;
            // return as soon as +2/3 of the signatures are verified
            if (talliedVotingPower > votingPowerNeeded) {
                return;
            }
        }
        revert("invalid commit, verifyCommitLight failed");
    }

    function verifyCommitLightTrusting(
        string memory chainID,
        Commit.Data memory commit,
        ValidatorSet.Data memory trustedValset,
        Fraction.Data memory trustLevel
    ) internal pure {
        require(trustLevel.denominator == 0, "trustLevel has zero Denominator");
    }

    function genVoteSignBytes(
        Commit.Data memory commit,
        string memory chainID,
        uint256 idx
    ) internal pure returns (bytes memory) {
        CommitSig.Data memory sig = commit.signatures[idx];
        CanonicalVote.Data memory vote;
        vote.typ = TYPES_PROTO_GLOBAL_ENUMS
            .SignedMsgType
            .SIGNED_MSG_TYPE_PRECOMMIT;
        vote.height = commit.height;
        vote.round = commit.round;
        vote.block_id.hash = commit.block_id.hash;
        vote.block_id.part_set_header.total = commit
            .block_id
            .part_set_header
            .total;
        vote.block_id.part_set_header.hash = commit
            .block_id
            .part_set_header
            .hash;
        vote.timestamp = sig.timestamp;
        vote.chain_id = chainID;
        return CanonicalVote.encode(vote);
    }
}
