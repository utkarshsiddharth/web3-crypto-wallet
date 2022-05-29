// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

abstract contract Logger {
    uint256 public testNum;

    constructor() {
        testNum = 1000;
    }

    function emitLog() public pure virtual returns (bytes32) {}

    function test() external view returns (uint256) {
        return testNum;
    }
}
