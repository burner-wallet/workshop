pragma solidity ^0.5.0;

import './FreeGas.sol';

contract NameTag is FreeGas {
  mapping(address => string) private _names;

  event NameSet(address indexed user, string name);

  function getName(address user) external view returns (string memory) {
    return _names[user];
  }

  function setName(string calldata newName) external {
    _names[_msgSender()] = newName;
    emit NameSet(_msgSender(), newName);
  }
}
