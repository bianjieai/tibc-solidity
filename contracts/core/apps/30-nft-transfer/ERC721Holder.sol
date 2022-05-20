// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../../../interfaces/ddc/DDC721/IERC721Receiver.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721HolderUpgradeable.sol";

contract ERC721Holder is IERC721Receiver, ERC721HolderUpgradeable {
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    )
        public
        virtual
        override(IERC721Receiver, ERC721HolderUpgradeable)
        returns (bytes4)
    {
        return super.onERC721Received.selector;
    }

    function onERC721BatchReceived(
        address,
        address,
        uint256[] memory,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721BatchReceived.selector;
    }
}
