// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./Transfer.sol";
import "./ERC1155Bank.sol";


contract ERC1155TransferBank is Transfer{

    ERC1155Bank bank;

    constructor(ERC1155Bank bank_) public{
        bank = bank_;
    }

    function _mint(address account,uint256 id,uint256 amount,bytes memory data)override internal returns (bool){
        try bank.mint(account, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    function _burn(address account,uint256 id,uint256 amount) override internal returns (bool){
        try bank.burn(account, id, amount) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    function _transferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) override internal returns (bool){
        try bank.transferFrom(from, to, id, amount, data) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }
}