// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Multisig {
    event TransactionSubmitted(uint indexed txIndex, address indexed to, uint amount);
    event TransactionApproved(uint indexed txIndex, address indexed approver);
    event TransactionExecuted(uint indexed txIndex);

    struct Transaction {
        address to;
        uint amount;
        bytes data;
        bool executed;
        uint approvals;
    }

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public requiredApprovals;

    Transaction[] public transactions;
    mapping(uint => mapping(address => bool)) public approvals;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    constructor(address[] memory _owners, uint _requiredApprovals) {
        require(_owners.length > 0, "Owners required");
        require(
            _requiredApprovals > 0 && _requiredApprovals <= _owners.length,
            "Invalid number of required approvals"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
        }

        requiredApprovals = _requiredApprovals;
    }

    function submitTransaction(
        address to,
        uint amount,
        bytes memory data
    ) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push(Transaction({
            to: to,
            amount: amount,
            data: data,
            executed: false,
            approvals: 0
        }));

        emit TransactionSubmitted(txIndex, to, amount);
    }

    function approveTransaction(uint txIndex) public onlyOwner {
        require(txIndex < transactions.length, "Transaction does not exist");
        Transaction storage transaction = transactions[txIndex];

        require(!transaction.executed, "Transaction already executed");
        require(!approvals[txIndex][msg.sender], "Transaction already approved by this owner");

        transaction.approvals += 1;
        approvals[txIndex][msg.sender] = true;

        emit TransactionApproved(txIndex, msg.sender);
    }

    function executeTransaction(uint txIndex) public onlyOwner {
        require(txIndex < transactions.length, "Transaction does not exist");
        Transaction storage transaction = transactions[txIndex];

        require(!transaction.executed, "Transaction already executed");
        require(transaction.approvals >= requiredApprovals, "Not enough approvals");
        require(address(this).balance >= transaction.amount, "Insufficient contract balance");

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.amount}(transaction.data);
        require(success, "Transaction failed");

        emit TransactionExecuted(txIndex);
    }

    receive() external payable {}
}
