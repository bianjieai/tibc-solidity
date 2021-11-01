// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "../libraries/utils/Strings.sol";
import "../interfaces/IRouting.sol";
import "../interfaces/IModule.sol";
import "../interfaces/IAccessManager.sol";

contract MockRoutingUpgrade is Initializable, OwnableUpgradeable, IRouting {
    using Strings for *;

    struct Rule {
        string val;
        bool isValue;
    }

    mapping(string => IModule) public modules;
    mapping(string => Rule) public router;
    // access control contract
    IAccessManager public accessManager;

    bytes32 public constant SET_ROUTING_RULES_ROLE =
        keccak256("SET_ROUTING_RULES_ROLE");
    bytes32 public constant ADD_ROUTING_ROLE = keccak256("ADD_ROUTING_ROLE");

    uint256 public version;

    // only authorized accounts can perform related transactions
    modifier onlyAuthorizee(bytes32 role) {
        require(accessManager.hasRole(role, _msgSender()), "not authorized");
        _;
    }


    function setVersion(uint256 _version) public {
        version = _version;
    }
    
    function initialize(address accessManagerContract) public initializer {
        accessManager = IAccessManager(accessManagerContract);
    }

    /**
     *  @notice return the module contract instance with the specified name
     *  @param moduleName  the module name
     */
    function getModule(string calldata moduleName)
        external
        view
        override
        returns (IModule)
    {
        return modules[moduleName];
    }

    /**
     * @notice verify that the routing rules are correct
     * @param sourceChain source chain name
     * @param destChain destination chain name
     * @param port application module name
     */
    function authenticate(
        string calldata sourceChain,
        string calldata destChain,
        string calldata port
    ) external view override returns (bool) {
        string memory wildcard = "*";

        // 1. *,*,*
        if (_isExistRule(_genCondition(wildcard, wildcard, wildcard))) {
            return true;
        }

        // 2. source,dest,moudle
        if (_isExistRule(_genCondition(sourceChain, destChain, port))) {
            return true;
        }

        //3. source,*,model
        if (_isExistRule(_genCondition(sourceChain, wildcard, port))) {
            return true;
        }

        //4. source,dest,*
        if (_isExistRule(_genCondition(sourceChain, destChain, wildcard))) {
            return true;
        }

        //5. source,*,*
        if (_isExistRule(_genCondition(sourceChain, wildcard, wildcard))) {
            return true;
        }

        //6. *,dest,model
        if (_isExistRule(_genCondition(sourceChain, destChain, port))) {
            return true;
        }

        //7. *,dest,*,
        if (_isExistRule(_genCondition(wildcard, sourceChain, wildcard))) {
            return true;
        }

        // 8. *,*,model
        if (_isExistRule(_genCondition(wildcard, wildcard, port))) {
            return true;
        }

        return false;
    }

    /**
     * @notice add new routing rules
     * @param _rules routing rules
     */
    function setRoutingRules(string[] calldata _rules)
        external
        onlyAuthorizee(SET_ROUTING_RULES_ROLE)
    {
        string[] memory mRules = new string[](_rules.length);
        for (uint256 i = 0; i < _rules.length; i++) {
            mRules[i] = _rules[i];
        }
        _setRuleMap(mRules);
    }

    /**
     * @notice add a module:
     * @param moduleName module name
     * @param moduleContract module contract address
     */
    function addRouting(string calldata moduleName, address moduleContract)
        external
        onlyAuthorizee(ADD_ROUTING_ROLE)
    {
        modules[moduleName] = IModule(moduleContract);
    }

    function _setRuleMap(string[] memory _rules) private {
        for (uint256 i = 0; i < _rules.length; i++) {
            router[_rules[i]].val = _rules[i];
            router[_rules[i]].isValue = true;
        }
    }

    function _isExistRule(string memory _rule) private view returns (bool) {
        return router[_rule].isValue;
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
