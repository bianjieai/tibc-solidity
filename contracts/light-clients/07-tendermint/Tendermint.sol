// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../interfaces/IClient.sol";
import "../../libraries/utils/Bytes.sol";
import "../../libraries/07-tendermint/LightClient.sol";
import "../../proto/Tendermint.sol";
import "./Verifier.sol";
import "../../proto/Commitment.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Tendermint is IClient, Ownable {
    // current light client status
    ClientState.Data public clientState;
    // consensus status of light clients
    mapping(uint256 => ConsensusState.Data) public consensusStates;
    //System time each time the client status is updated
    mapping(uint256 => uint256) private processedTime;

    constructor(address clientManagerAddr) public {
        transferOwnership(clientManagerAddr);
    }

    /*  @notice   returns the latest height of the current light client
     *
     */
    function getLatestHeight()
        external
        view
        override
        returns (Height.Data memory)
    {
        return clientState.latest_height;
    }

    /*  @notice   return the status of the current light client
     *
     */
    function status() external view override returns (Status) {
        ConsensusState.Data storage consState = consensusStates[
            clientState.latest_height.revision_height
        ];
        if (consState.root.length == 0) {
            return Status.Unknown;
        }

        if (
            !(uint256(consState.timestamp.secs + clientState.trusting_period) >
                block.timestamp)
        ) {
            return Status.Expired;
        }
        return Status.Active;
    }

    /*  @notice                 this function is called by the ClientManager contract, the purpose is to initialize light client state

     *  @param clientStateBz      light client status
     *  @param consensusStateBz   light client consensus status
     */
    function initialize(
        bytes calldata clientStateBz,
        bytes calldata consensusStateBz
    ) external override onlyOwner {
        ClientStateCodec.decode(clientState, clientStateBz);
        consensusStates[
            clientState.latest_height.revision_height
        ] = ConsensusStateCodec.decode(consensusStateBz);
        processedTime[clientState.latest_height.revision_height] = block
            .timestamp;
    }

    /* @notice                  this function is called by the ClientManager contract, the purpose is to update the state of the light client
     *
     *  @param clientStateBz      light client status
     *  @param consensusStateBz   light client consensus status
     */
    function upgrade(
        bytes calldata clientStateBz,
        bytes calldata consensusStateBz
    ) external override onlyOwner {
        ClientStateCodec.decode(clientState, clientStateBz);
        consensusStates[
            clientState.latest_height.revision_height
        ] = ConsensusStateCodec.decode(consensusStateBz);
        processedTime[clientState.latest_height.revision_height] = block
            .timestamp;
    }

    /* @notice                  this function is called by the relayer, the purpose is to update and verify the state of the light client
     *
     *  @param headerBz          block header of the counterparty chain
     */
    function checkHeaderAndUpdateState(bytes calldata headerBz)
        external
        override
        onlyOwner
    {
        Header.Data memory header = HeaderCodec.decode(headerBz);
        ConsensusState.Data memory tmConsState = consensusStates[
            header.trusted_height.revision_height
        ];

        // check heaer
        require(
            Bytes.equal(
                LightClient.genValidatorSetHash(header.trusted_validators),
                tmConsState.next_validators_hash
            ),
            "invalid validator set"
        );
        require(
            uint64(header.signed_header.header.height) >
                header.trusted_height.revision_height,
            "invalid block height"
        );

        // SignedHeader.Data memory trustedHeader;
        // trustedHeader.header.chain_id = state.chain_id;
        // trustedHeader.header.height = int64(
        //     state.latest_height.revision_height
        // );
        // trustedHeader.header.time = tmConsState.timestamp;
        // trustedHeader.header.next_validators_hash = tmConsState
        //     .next_validators_hash;

        // Timestamp.Data memory currentTimestamp;
        // currentTimestamp.secs = int64(block.timestamp);

        // Verify next header with the passed-in trustedVals
        // - asserts trusting period not passed
        // - assert header timestamp is not past the trusting period
        // - assert header timestamp is past latest stored consensus state timestamp
        // - assert that a TrustLevel proportion of TrustedValidators signed new Commit
        // TODO
        // LightClient.verify(
        //     trustedHeader,
        //     header.trusted_validators,
        //     header.signed_header,
        //     header.validator_set,
        //     clientSate.trusting_period,
        //     currentTimestamp,
        //     clientSate.max_clock_drift,
        //     clientSate.trust_level
        // );

        // update the client state of the light client
        if (
            uint64(header.signed_header.header.height) >
            clientState.latest_height.revision_height
        ) {
            clientState.latest_height.revision_height = uint64(
                header.signed_header.header.height
            );
        }
        // save the consensus state of the light client
        ConsensusState.Data memory newConsState;
        newConsState.timestamp = header.signed_header.header.time;
        newConsState.root = header.signed_header.header.app_hash;
        newConsState.next_validators_hash = header
            .signed_header
            .header
            .next_validators_hash;
        consensusStates[
            clientState.latest_height.revision_height
        ] = newConsState;
        processedTime[clientState.latest_height.revision_height] = block
            .timestamp;
    }

    /* @notice                  this function is called by the relayer, the purpose is to use the current state of the light client to verify cross-chain data packets
     *
     *  @param height           the height of cross-chain data packet proof
     *  @param proof            proof of the existence of cross-chain data packets
     *  @param sourceChain      the original chain of the cross-chain data package
     *  @param destChain        the destination chain of the cross-chain data packet
     *  @param sequence         the sequence of cross-chain data packets
     *  @param commitmentBytes  the hash of the cross-chain data packet
     */
    function verifyPacketCommitment(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata commitmentBytes
    ) external override {
        Verifier.verifyCommitment(
            clientState,
            consensusStates[height.revision_height],
            processedTime[height.revision_height],
            proof,
            sourceChain,
            destChain,
            sequence,
            commitmentBytes
        );
    }

    /* @notice                  this function is called by the relayer, the purpose is to use the current state of the light client to verify the acknowledgement of cross-chain data packets
     *
     *  @param height           the height of cross-chain data packet proof
     *  @param proof            proof of the existence of cross-chain data packets
     *  @param sourceChain      the original chain of the cross-chain data package
     *  @param destChain        the destination chain of the cross-chain data packet
     *  @param sequence         the sequence of cross-chain data packets
     *  @param acknowledgement  the hash of the acknowledgement of the cross-chain data packet
     */
    function verifyPacketAcknowledgement(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence,
        bytes calldata acknowledgement
    ) external override {
        Verifier.verifyAcknowledgement(
            clientState,
            consensusStates[height.revision_height],
            processedTime[height.revision_height],
            proof,
            sourceChain,
            destChain,
            sequence,
            acknowledgement
        );
    }

    /* @notice                  this function is called by the relayer, the purpose is to use the current state of the light client to verify the cross-chain data packets
     *
     *  @param height           the height of cross-chain data packet proof
     *  @param proof            proof of the existence of cross-chain data packets
     *  @param sourceChain      the original chain of the cross-chain data package
     *  @param destChain        the destination chain of the cross-chain data packet
     *  @param sequence         the sequence of cross-chain data packets
     */
    function verifyPacketCleanCommitment(
        Height.Data calldata height,
        bytes calldata proof,
        string calldata sourceChain,
        string calldata destChain,
        uint64 sequence
    ) external override {
        Verifier.verifyCleanCommitment(
            clientState,
            consensusStates[height.revision_height],
            processedTime[height.revision_height],
            proof,
            sourceChain,
            destChain,
            sequence
        );
    }
}
