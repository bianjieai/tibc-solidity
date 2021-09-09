// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract ClientManager is Ownable, ReentrancyGuard, IClientManager {
    // chain_name -> IClient implementation address
    mapping(string => IClient) public clients;
    mapping(string => mapping(address => uint64)) public relayers;

    // check if caller is relayer
    modifier onlyRelayer(string memory chainName) {
        require(
            relayers[chainName][msg.sender] > 0x0,
            "caller is not a relayer"
        );
        _;
    }

    /* @notice                  this function is intended to be called by owner to create a light client and initialize light client data.
     *
     *  @param chainName        the counterparty chain name
     *  @param clientAddress    light client contract address
     *  @param clientState      light client status
     *  @param consensusState   light client consensus status
     */
    function createClient(
        string calldata chainName,
        address clientAddress,
        bytes calldata clientState,
        bytes calldata consensusState
    ) external onlyOwner {
        require(
            address(clients[chainName]) == address(0x0),
            "chainName already exist"
        );
        require(
            clientAddress != address(0x0),
            "clientAddress can not be empty"
        );

        IClient client = IClient(clientAddress);
        client.initialize(clientState, consensusState);
        clients[chainName] = client;
    }

    /* @notice                  this function is called by the relayer, the purpose is to update the state of the light client
     *
     *  @param chainName        the counterparty chain name
     *  @param header           block header of the counterparty chain
     */
    function updateClient(string calldata chainName, bytes calldata header)
        external
        onlyRelayer(chainName)
        nonReentrant
    {
        IClient client = clients[chainName];
        client.checkHeaderAndUpdateState(header);
    }

    /* @notice                  this function is called by the owner, the purpose is to update the state of the light client
     *
     *  @param chainName        the counterparty chain name
     *  @param clientState      light client status
     *  @param consensusState   light client consensus status
     */
    function upgradeClient(
        string calldata chainName,
        bytes calldata clientState,
        bytes calldata consensusState
    ) external onlyOwner nonReentrant {
        IClient client = clients[chainName];
        client.upgrade(clientState, consensusState);
    }

    /* @notice                  this function is called by the owner, the purpose is to register the relayer address of a light client
     *
     *  @param chainName        the counterparty chain name
     *  @param address          relayer address
     */
    function registerRelayer(string calldata chainName, address relayer)
        external
        onlyOwner
    {
        require(
            relayers[chainName][relayer] == 0x0,
            "relayer already registered"
        );
        relayers[chainName][relayer] = 1;
    }

    function getClient(string memory chainName)
        public
        override
        returns (IClient)
    {
        return clients[chainName];
    }

    function getChainName()
        external
        override
        returns (string memory)
    {
        return "";
    }
}
