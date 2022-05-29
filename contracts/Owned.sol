// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

contract Owned {
    address public owner;

    modifier adminCheck() {
        require(msg.sender == owner, "only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
}
