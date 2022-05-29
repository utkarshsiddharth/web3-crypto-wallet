// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

// they cannot inherit from other contract
// they can inherit form other interfaces
// they cannot declare a consturctor or state variables
// all declared functions have to be external

interface IFaucet {
    function addFunds() external payable;

    function withdraw(uint256 withdrawAmount) external;
}
