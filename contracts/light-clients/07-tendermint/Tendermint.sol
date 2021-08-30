// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../interfaces/IClient.sol";
import "../../interfaces/IClientManager.sol";
import "../../libraries/02-client/Client.sol";
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

     *  @param clientState      light client status
     *  @param consensusState   light client consensus status
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
     *  @param clientState      light client status
     *  @param consensusState   light client consensus status
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
     *  @param header           block header of the counterparty chain
     */
    function checkHeaderAndUpdateState(bytes calldata headerBz)
        external
        override
        onlyOwner
    {
        Header.Data memory header = Header.decode(headerBz);
        // ConsensusState.Data memory tmConsState = consensusStates[
        //     header.trusted_height.revision_height
        // ];
        // TODO check heaer
        // HeaderLib.checkValidity(header, clientState, tmConsState);
        if (
            uint64(header.signed_header.header.height) >
            clientState.latest_height.revision_height
        ) {
            clientState.latest_height.revision_height = uint64(
                header.signed_header.header.height
            );
        }

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

    function checkValidity(Header.Data memory header) internal {}

    function checkTrustedHeader(
        Header.Data memory header,
        ConsensusState.Data memory consensusState
    ) internal {}
}
