// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../proto/Ack.sol";
import "../core/02-client/ClientManager.sol";
import "../interfaces/IPacket.sol";
import "../interfaces/ITransfer.sol";
import "../interfaces/IERC1155Bank.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "hardhat/console.sol";

contract MockTransfer is
    Initializable,
    ITransfer,
    ERC721HolderUpgradeable,
    OwnableUpgradeable
{
    string private constant PORT = "nft";

    IPacket public packet;
    IClientManager public clientManager;

    // check if caller is clientManager
    // check if caller is clientManager
    modifier onlyPacket() {
        require(msg.sender == address(packet), "caller not packet contract");
        _;
    }

    function initialize(address packetContract, address clientMgrContract)
        public
        initializer
    {
        packet = IPacket(packetContract);
        clientManager = IClientManager(clientMgrContract);
    }

    /**
     * @notice this function is to send nft and construct data packet
     * @param transferData Send the data needed by nft
     */
    function sendTransfer(TransferDataTypes.TransferData calldata transferData)
        external
        override
    {
        PacketTypes.Packet memory crossPacket = PacketTypes.Packet({
            sequence: 1,
            port: PORT,
            sourceChain: "source",
            destChain: transferData.destChain,
            relayChain: transferData.relayChain,
            data: bytes("wd")
        });
        packet.sendPacket(crossPacket);
    }

    /**
     * @notice this function is to receive packet
     * @param pac Data package containing nft data
     */
    function onRecvPacket(PacketTypes.Packet calldata pac)
        external
        override
        onlyPacket
        returns (bytes memory acknowledgement)
    {
        if (pac.data.length != 0) {
            return NewAcknowledgement(true, "");
        }
        return NewAcknowledgement(false, "error");
    }

    /**
     * @notice This method is start ack method
     * @param pac Packets transmitted
     * @param acknowledgement ack
     */
    function onAcknowledgementPacket(
        PacketTypes.Packet calldata pac,
        bytes calldata acknowledgement
    ) external override onlyPacket {}

    /**
     * @notice this function is to create ack
     * @param success success or not
     */
    function NewAcknowledgement(bool success, string memory errMsg)
        public
        pure
        returns (bytes memory)
    {
        Acknowledgement.Data memory ack;
        if (success) {
            ack.result = hex"01";
        } else {
            ack.error = errMsg;
        }
        return Acknowledgement.encode(ack);
    }
}
