// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../interfaces/IClient.sol";
import "../../interfaces/IClientManager.sol";
import "../../libraries/Bytes.sol";
import "../../libraries/02-client/Client.sol";
import "../../libraries/07-tendermint/LightClient.sol";
import "../../libraries/Tendermint.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract Tendermint is IClient, Ownable, ReentrancyGuard {
    string public constant clientType = "tendermint";

    // current light client status
    ClientState.Data public clientState;

    // consensus status of light clients
    mapping(uint64 => ConsensusState.Data) public consensusStates;

    // ClientManager contract of light clients
    IClientManager public clientManager;

    constructor(address clientManagerAddr) public {
        transferOwnership(clientManagerAddr);
        clientManager = IClientManager(clientManagerAddr);
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
    //TODO
    function status() external view override returns (int8) {}

    /*  @notice                 this function is called by the ClientManager contract, the purpose is to initialize light client state

     *  @param clientStateBz      light client status
     *  @param consensusStateBz   light client consensus status
     */
    function initialize(
        bytes calldata clientStateBz,
        bytes calldata consensusStateBz
    ) external override onlyOwner {
        clientState = ClientState.decode(clientStateBz);
        ConsensusState.Data memory consData = ConsensusState.decode(
            consensusStateBz
        );
        consensusStates[clientState.latest_height.revision_height] = consData;
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
        clientState = ClientState.decode(clientStateBz);
        ConsensusState.Data memory consData = ConsensusState.decode(
            consensusStateBz
        );
        consensusStates[clientState.latest_height.revision_height] = consData;
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
        Header.Data memory header = Header.decode(headerBz);
        ConsensusState.Data memory tmConsState = consensusStates[
            header.trusted_height.revision_height
        ];
        // TODO check heaer
        checkValidity(header, clientState, tmConsState);

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
        ConsensusState.Data storage newConsState;
        newConsState.timestamp = header.signed_header.header.time;
        newConsState.root = header.signed_header.header.app_hash;
        newConsState.next_validators_hash = header
            .signed_header
            .header
            .next_validators_hash;
        consensusStates[
            clientState.latest_height.revision_height
        ] = newConsState;
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
    ) external override {}

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
    ) external override {}

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
    ) external override {}

    /*  @notice                   this function checks if the Tendermint header is valid.
     *  @param header             header to be verified
     *  @param clientSate         the trusted clientSate specified by the user in the contract,
     *  @param consensusState     the trusted consensusState specified by the user in the contract,
     */
    function checkValidity(
        Header.Data memory header,
        ClientState.Data memory clientSate,
        ConsensusState.Data memory consensusState
    ) internal view {
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

        Timestamp.Data memory currentTimestamp;
        currentTimestamp.secs = int64(block.timestamp);

        // Verify next header with the passed-in trustedVals
        // - asserts trusting period not passed
        // - assert header timestamp is not past the trusting period
        // - assert header timestamp is past latest stored consensus state timestamp
        // - assert that a TrustLevel proportion of TrustedValidators signed new Commit
        LightClient.verify(
            trustedHeader,
            header.trusted_validators,
            header.signed_header,
            header.validator_set,
            clientSate.trusting_period,
            currentTimestamp,
            clientSate.max_clock_drift,
            clientSate.trust_level
        );
    }

    /*  @notice                   this function checks that consensus state matches trusted fields of Header.
     *  @param consensusState     the trusted consensusState specified by the user in the contract,
     */
    function checkTrustedHeader(
        Header.Data memory header,
        ConsensusState.Data memory consensusState
    ) internal pure {
        bytes memory expRoot = LightClient.genValidatorSetHash(
            header.trusted_validators
        );
        require(
            Bytes.equal(expRoot, consensusState.next_validators_hash),
            "invalid validator set"
        );
    }
}
