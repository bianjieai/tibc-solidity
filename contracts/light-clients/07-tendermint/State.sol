// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../interfaces/IClient.sol";
import "../../libraries/utils/Bytes.sol";
import "../../libraries/07-tendermint/LightClient.sol";
import "../../proto/Tendermint.sol";
import "../../proto/Commitment.sol";
import "./Verifier.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract State {
    // current light client status
    bytes public clientState;
    // consensus status of light clients
    mapping(uint256 => bytes) public consensusStates;
    //System time each time the client status is updated
    mapping(uint256 => uint256) private processedTime;

    function setProcessedTime(uint256 height) internal {
        processedTime[height] = now;
    }

    function getProcessedTime(uint256 height) internal view returns (uint256) {
        return processedTime[height];
    }

    function getClientState() internal view returns (ClientState.Data memory) {
        return ClientState.decode(clientState);
    }

    function setClientState(ClientState.Data memory _clientState) internal {
        clientState = ClientState.encode(_clientState);
    }

    function setClientState(bytes memory _clientState) internal {
        clientState = _clientState;
    }

    function getConsensusState(uint256 height)
        internal
        view
        returns (ConsensusState.Data memory)
    {
        return ConsensusState.decode(consensusStates[height]);
    }

    function setConsensusState(
        uint256 height,
        ConsensusState.Data memory _consensusState
    ) internal {
        consensusStates[height] = ConsensusState.encode(_consensusState);
    }

    function setConsensusState(uint256 height, bytes memory _consensusState)
        internal
    {
        consensusStates[height] = _consensusState;
    }
}
