// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CoinFlip {
    address public owner;

    event CoinFlipped(address indexed player, uint256 betAmount, bool won);

    struct Transaction {
        uint256 betAmount;
        bool won;
        uint256 timestamp;
    }

    mapping(address => Transaction[]) private transactionHistory;

    constructor() {
        owner = msg.sender;
    }

    enum Choice {
        Heads,
        Tails
    }

    function flipCoin(Choice _choice) public payable {
        require(msg.value > 0, "Bet amount must be greater than 0");

        // generate a pseudo-random number (either 0 or 1)
        bool coinFlipResult = (block.timestamp + block.prevrandao) % 2 == 0;

        bool playerWon = (_choice == Choice.Heads && coinFlipResult) ||
            (_choice == Choice.Tails && !coinFlipResult);

        if (playerWon) {
            uint256 winnings = msg.value * 2;

            // Check if the contract has enough balance to pay the winnings
            require(address(this).balance >= winnings, "Contract does not have enough balance to pay out winnings");

            // Transfer the winnings to the player
            payable(msg.sender).transfer(winnings);
        }

        // Record the transaction in history
        transactionHistory[msg.sender].push(Transaction({
            betAmount: msg.value,
            won: playerWon,
            timestamp: block.timestamp
        }));

        emit CoinFlipped(msg.sender, msg.value, playerWon);
    }

    function getMyTransactionHistory() public view returns (Transaction[] memory) {
        return transactionHistory[msg.sender];
    }

    function withdrawAll() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
