// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

contract Storage {
    mapping(uint256 => uint256) public aa;
    mapping(address => uint256) public bb;

    modifier limitWithdrawal(uint256 withdrawAmount) {
        require(
            withdrawAmount < 2000000000000000000,
            "withdraw amount should be less than 2 ether"
        );
        _;
    }

    uint8 public a = 7; // 1 byte
    uint16 public b = 10; // 2 byte
    address public c = 0xF77FCF8e84c1A61895f5E2aDA6c78D1C22BB930F; // 2 byte
    bool d = true; // 1 byte
    uint64 public e = 15; // 8 byte

    // total 32 bytes - will be stored in slot 0
    // 0x0f01f77fcf8e84c1a61895f5e2ada6c78d1c22bb930f000a07

    uint256 public f = 200; // 32 byte - slot 1
    uint8 public g = 40; // 1 byte - slot 2
    uint256 public h = 789; // 32 byte - slot 3

    constructor() {
        aa[2] = 4;
        aa[3] = 10;

        bb[0xF77FCF8e84c1A61895f5E2aDA6c78D1C22BB930F] = 10000;
    }
}

// web3.eth.getStorageAt("0xF77FCF8e84c1A61895f5E2aDA6c78D1C22BB930F",0)

// 0x0000000000000000000000000000000000000000000000000000000000000000
