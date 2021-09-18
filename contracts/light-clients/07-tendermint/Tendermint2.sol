// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../interfaces/IClient.sol";
import "../../libraries/utils/Bytes.sol";
import "../../libraries/07-tendermint/LightClient.sol";
import "./Verifier.sol";
import "../../proto/Commitment.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Tendermint2 is Ownable {
    // current light client status
    ClientState public clientState;
    // challenge period (in seconds)
    uint256 public lockPeriod;
    // untrustedHeader will be confirmed and submitted at lastHeaderCommitAt,
    // if it is equal to 0, it means that there is no lastUntrustedHeader that can accept the challenge.
    uint256 public untrustedHeaderCommitAt;
    // unconfirmed block header currently in the challenge period
    UntrustedHeader public untrustedHeader;

    // consensus status of light clients
    mapping(uint256 => ConsensusState) public consensusStates;
    // system time each time the client status is updated
    mapping(uint256 => uint256) private processedTime;

    //struct definition
    struct ClientState {
        string chain_id;
        Fraction.Data trust_level;
        int64 trusting_period;
        int64 unbonding_period;
        int64 max_clock_drift;
        Height.Data latest_height;
        ProofSpec.Data[] proof_specs;
        MerklePrefix.Data merkle_prefix;
        uint64 time_delay;
    }

    struct ConsensusState {
        uint256 timestamp;
        bytes32 root;
        bytes32 next_validators_hash;
    }

    struct UntrustedHeader {
        bytes32 block_hash;
        bytes32 app_hash;
        bytes32 next_validators_hash;
        uint256 timestamp;
        Height.Data height;
        address submitter;
    }

    constructor(address clientManagerAddr) public {
        transferOwnership(clientManagerAddr);
    }

    /*  @notice   returns the latest height of the current light client
     *
     */
    function getLatestHeight() external view returns (Height.Data memory) {
        return clientState.latest_height;
    }

    /* @notice                  this function is called by the relayer, the purpose is to update and verify the state of the light client
     *
     *  @param headerBz          block header of the counterparty chain
     */
    function update(bytes calldata untrustedHeaderBz, address submitter)
        external
        onlyOwner
    {
        (
            bytes32 block_hash,
            bytes32 app_hash,
            bytes32 next_validators_hash,
            uint256 timestamp,
            uint256 height
        ) = abi.decode(
                untrustedHeaderBz,
                (bytes32, bytes32, bytes32, uint256, uint256)
            );
        require(
            height > clientState.latest_height.revision_height,
            "invalid block height"
        );
        require(
            block.timestamp > untrustedHeaderCommitAt,
            "The challenge period is not over"
        );

        if (untrustedHeader.timestamp > 0) {
            // commit last untrusted header
            ConsensusState memory newConsState;
            newConsState.timestamp = untrustedHeader.timestamp;
            newConsState.root = untrustedHeader.app_hash;
            newConsState.next_validators_hash = untrustedHeader
                .next_validators_hash;
            consensusStates[
                clientState.latest_height.revision_height
            ] = newConsState;
            processedTime[clientState.latest_height.revision_height] = block
                .timestamp;

            // update client state
            clientState.latest_height = untrustedHeader.height;
        }

        // update untrustedHeader
        untrustedHeader.block_hash = block_hash;
        untrustedHeader.app_hash = app_hash;
        untrustedHeader.next_validators_hash = next_validators_hash;
        untrustedHeader.timestamp = timestamp;
        untrustedHeader.height = Height.Data(
            clientState.latest_height.revision_number,
            uint64(height)
        );
        untrustedHeader.submitter = submitter;

        // update lastHeaderCommitAt
        untrustedHeaderCommitAt = block.timestamp + lockPeriod;
    }

    function submitMisbehaviour(bytes memory headerBz) public {
        require(untrustedHeaderCommitAt > 0, "No challenge block");
        Header.Data memory header = HeaderCodec.decode(headerBz);
    }
}
