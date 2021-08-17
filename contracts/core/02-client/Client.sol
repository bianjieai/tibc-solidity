// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClient.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";

contract ClientManager is Ownable, ReentrancyGuard {
    // chain_name -> IClient implementation address
    mapping(string => IClientState) public CLIENTS;

    function updateHeader(string memory chainName, bytes calldata header)
        external
        nonReentrant
    {
        IClientState client = CLIENTS[chainName];
        client.checkHeaderAndUpdateState(header);
    }
}
