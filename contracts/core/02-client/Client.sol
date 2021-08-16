// Apache-License: 2.0
pragma solidity ^0.8.0;

import "../../interfaces/IClient.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract ClientManager is Ownable, ReentrancyGuard {
    // chain_name -> IClient implementation address
    mapping(string => IClientState) public clients;

    function updateHeader(string chainName, bytes calldata header)
        external
        override
        nonReentrant
    {
        IClientState client = clients[chainName];
        client.checkHeaderAndUpdateState(header);
    }
}
