// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../interfaces/IClientManager.sol";
import "../interfaces/IClient.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

contract MockClientManager is
    Initializable,
    OwnableUpgradeable,
    IClientManager
{
    // the name of this chain cannot be changed once initialized
    string private nativeChainName;
    // light client currently registered in this chain
    mapping(string => IClient) public clients;
    // relayer registered by each light client
    mapping(string => mapping(address => bool)) public relayers;

    uint256 public version;

    function initialize(string memory name) public initializer {
        nativeChainName = name;
        __Ownable_init();
    }

    // check if caller is relayer
    modifier onlyRelayer(string memory chainName) {
        require(relayers[chainName][msg.sender], "caller not register");
        _;
    }

    function setVersion(uint256 _version) public {
        version = _version;
    }

    /**
     *  @notice this function is intended to be called by owner to create a light client and initialize light client data.
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
        client.initializeState(clientState, consensusState);
        clients[chainName] = client;
    }

    /**
     *  @notice this function is called by the relayer, the purpose is to update the state of the light client
     *  @param chainName  the counterparty chain name
     *  @param header     block header of the counterparty chain
     */
    function updateClient(string calldata chainName, bytes calldata header)
        external
        onlyRelayer(chainName)
    {
        IClient client = clients[chainName];
        require(client.status() == IClient.Status.Active, "client not active");
        client.checkHeaderAndUpdateState(header);
    }

    /**
     *  @notice this function is called by the owner, the purpose is to update the state of the light client
     *  @param chainName        the counterparty chain name
     *  @param clientState      light client status
     *  @param consensusState   light client consensus status
     */
    function upgradeClient(
        string calldata chainName,
        bytes calldata clientState,
        bytes calldata consensusState
    ) external onlyOwner {
        IClient client = clients[chainName];
        client.upgrade(clientState, consensusState);
    }

    /**
     *  @notice this function is called by the owner, the purpose is to register the relayer address of a light client
     *  @param chainName  the counterparty chain name
     *  @param relayer    relayer address
     */
    function registerRelayer(string calldata chainName, address relayer)
        external
        onlyOwner
    {
        require(!relayers[chainName][relayer], "relayer already registered");
        relayers[chainName][relayer] = true;
    }

    /**
     *  @notice obtain the contract address of the client according to the registered client name
     *  @param chainName  the counterparty chain name
     */
    function getClient(string memory chainName)
        public
        override
        returns (IClient)
    {
        return clients[chainName];
    }

    /**
     *  @notice get the name of this chain
     */
    function getChainName() external view override returns (string memory) {
        return nativeChainName;
    }

    /**
     *  @notice get the latest height of the specified client update
     *  @param chainName  the counterparty chain name
     */
    function getLatestHeight(string memory chainName)
        public
        view
        override
        returns (Height.Data memory)
    {
        return (clients[chainName]).getLatestHeight();
    }
}
