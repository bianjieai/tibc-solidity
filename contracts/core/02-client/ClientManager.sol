// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClientManager.sol";
import "../../interfaces/IClient.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract ClientManager is Ownable, ReentrancyGuard, IClientManager {
    // chain_name -> IClient implementation address
    mapping(string => address) private clients;

    function createClient(
        string calldata chainName,
        address clientAddress,
        bytes calldata clientState,
        bytes calldata consensusState
    ) external onlyOwner {
        require(
            clients[chainName] == address(0x0),
            "chainName can not be empty"
        );
        require(
            clientAddress != address(0x0),
            "clientAddress can not be empty"
        );
        clients[chainName] = clientAddress;
    }

    function getClient(string calldata chainName)
        public
        view
        override
        returns (address)
    {
        return clients[chainName];
    }

    function updateHeader(string calldata chainName, bytes calldata header)
        external
        nonReentrant
    {
        IClient client = IClient(clients[chainName]);
        client.checkHeaderAndUpdateState(header);
    }
}
