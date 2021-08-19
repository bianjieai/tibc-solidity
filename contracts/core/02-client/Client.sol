// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClient.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract ClientManager is Ownable, ReentrancyGuard {
    // chain_name -> IClient implementation address
    mapping(string => address) private CLIENTS;

    function createClient(string calldata chainName, address client) external {
        CLIENTS[chainName] = client;
    }

    function getClient(string calldata chainName) public view returns (address){
        return CLIENTS[chainName];
    }

    function updateHeader(string calldata chainName, bytes calldata header)
        external
        nonReentrant
    {
        IClientState client = IClientState(CLIENTS[chainName]);
        client.checkHeaderAndUpdateState(header);
    }
}
