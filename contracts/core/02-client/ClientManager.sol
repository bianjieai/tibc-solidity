// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract ClientManager is Ownable, ReentrancyGuard, IClientManager {
    // chain_name -> IClient implementation address
    mapping(string => IClient) public clients;
    mapping(string => mapping(address => uint64)) public relayers;

    // check if caller is relayer
    modifier onlyRelayer(string calldata chainName) {
        require(
            relayers[chainName][msg.sender] > 0x0,
            "caller is not a relayer"
        );
        _;
    }

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

    function updateClient(string calldata chainName, bytes calldata header)
        external
        onlyRelayer(chainName)
        nonReentrant
    {
        IClient client = clients[chainName];
        client.checkHeaderAndUpdateState(header);
    }

    function upgradeClient(
        string calldata chainName,
        bytes calldata clientState,
        bytes calldata consensusState
    ) external onlyOwner nonReentrant {
        IClient client = clients[chainName];
        client.upgrade(clientState, consensusState);
    }

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

    function getClient(string calldata chainName)
        public
        view
        override
        returns (IClient)
    {
        return clients[chainName];
    }
}
