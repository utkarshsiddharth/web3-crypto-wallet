// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;
import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    mapping(uint256 => address) public funders;
    uint256 public noOfFunders;

    receive() external payable {}

    function test1() external adminCheck {
        // some stuff only admin can access
    }

    function test2() external adminCheck {
        // some stuff only admin can access
    }

    modifier limitWithdrawal(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 1000000000000000000,
            "withdraw amount should be less than 1 ether"
        );
        _; // just like next() in express
    } // just like middleware

    function addFunds() external payable override {
        uint256 index = noOfFunders++;
        funders[index] = msg.sender;
    }

    function emitLog() public pure override returns (bytes32) {
        return "Hello Logger";
    }

    function transferOwnership(address newOwner) external adminCheck {
        owner = newOwner; // transfer the ownership
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return funders[index];
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdrawal(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }
}

// const instance = await Faucet.deployed()

// await instance.addFunds({from:accounts[1],value:"1000000000000000000"})
// await instance.addFunds({from:accounts[0],value:"2000000000000000000"})

// await instance.withdraw("500000000000000000000",{from: accounts[1]})
// await instance.withdraw("3000000000000000000",{from: accounts[1]}) - not allowed

// await instance.test1() - admin (will work)
// await instance.test1({from: accounts[1]}) - admin (will not work)

// instance.getFunderAtIndex(0)
