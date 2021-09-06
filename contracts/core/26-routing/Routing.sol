// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/access/Ownable.sol";

import "../../libraries/utils/Strings.sol";
import "../../interfaces/IRouting.sol";
import "../../interfaces/IModule.sol";

// import "hardhat/console.sol";

contract Routing is Ownable, IRouting {
    struct ruleData {
        string val;
        bool isValue;
    }

    using Strings for *;
    string[] public rules;
    mapping(string => IModule) public moduleMap;
    mapping(string => ruleData) public ruleMap;

    constructor(string[] memory _rules) public {
        rules = _rules;
        _setRuleMap();
    }

    function getMoudle(string calldata _moduleName)
        external
        view
        override
        returns (IModule)
    {
        return moduleMap[_moduleName];
    }

    /*
     * @notice Authenticate:
     * @param _sourceChain First string
     * @param _destChain Second string
     * @param _port Third string
     */
    function authenticate(
        string calldata _sourceChain,
        string calldata _destChain,
        string calldata _port
    ) external view override returns (bool) {
        string memory wildcard = "*";

        // 1. *,*,*
        string memory condition = _genCondition(wildcard, wildcard, wildcard);
        if (_isExistRule(condition)) {
            return true;
        }

        // 2. source,dest,moudle
        condition = _genCondition(_sourceChain, _destChain, _port);
        if (_isExistRule(condition)) {
            return true;
        }

        //3. source,*,model
        condition = _genCondition(_sourceChain, wildcard, _port);
        if (_isExistRule(condition)) {
            return true;
        }

        //4. source,dest,*
        condition = _genCondition(_sourceChain, _destChain, wildcard);
        if (_isExistRule(condition)) {
            return true;
        }

        //5. source,*,*
        condition = _genCondition(_sourceChain, wildcard, wildcard);
        if (_isExistRule(condition)) {
            return true;
        }

        //6. *,dest,model
        condition = _genCondition(_sourceChain, _destChain, _port);
        if (_isExistRule(condition)) {
            return true;
        }

        //7. *,dest,*,
        condition = _genCondition(wildcard, _destChain, wildcard);
        if (_isExistRule(condition)) {
            return true;
        }

        // 8. *,*,model
        condition = _genCondition(wildcard, wildcard, _port);
        if (_isExistRule(condition)) {
            return true;
        }

        return false;
    }

    function setRoutingRules(string[] calldata _rules) external onlyOwner {
        uint32 i;
        string[] memory mRules;
        for (i = 0; i < _rules.length; i++) {
            mRules[i] = _rules[i];
        }
        rules = mRules;
        _setRuleMap();
    }

    /*
     * @notice add a module:
     * @param _moduleName First string
     * @param _moduleAddr Second address
     */
    function addRouting(string calldata _moduleName, address _moduleAddr)
        external
        onlyOwner
    {
        moduleMap[_moduleName] = IModule(_moduleAddr);
    }

    function _setRuleMap() private {
        uint8 i;
        for (i = 0; i < rules.length; i++) {
            ruleMap[rules[i]].val = rules[i];
            ruleMap[rules[i]].isValue = true;
        }
    }

    function _isExistRule(string memory _rule) private view returns (bool) {
        return ruleMap[_rule].isValue;
    }

    function _genCondition(
        string memory prefix,
        string memory mid,
        string memory suffix
    ) private pure returns (string memory) {
        Strings.slice[] memory parts = new Strings.slice[](3);
        parts[0] = prefix.toSlice();
        parts[1] = mid.toSlice();
        parts[2] = suffix.toSlice();
        string memory condition = ",".toSlice().join(parts);
        return condition;
    }
}
