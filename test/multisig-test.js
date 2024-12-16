const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Multisig Contract", function () {
    let multisig, owner, approver1, approver2, approver3, recipient;

    beforeEach(async function () {
        // Get signers
        [owner, approver1, approver2, approver3, recipient] = await ethers.getSigners();

        // Deploy the Multisig contract
        const MultisigFactory = await ethers.getContractFactory("Multisig");
        multisig = await MultisigFactory.deploy(
            [approver1.address, approver2.address, approver3.address], // Owners
            2 // Required approvals
        );

        // Wait for the contract deployment transaction to be mined
        await multisig.deployTransaction.wait();

        // Fund the Multisig contract with 10 ETH
        await owner.sendTransaction({
            to: multisig.address,
            value: ethers.utils.parseEther("10.0"),
        });
    });

    it("Should require two approvals to execute a transaction", async function () {
        const txAmount = ethers.utils.parseEther("1.0");

        // Step 1: Submit a transaction
        await expect(multisig.connect(approver1).submitTransaction(recipient.address, txAmount, "0x"))
            .to.emit(multisig, "TransactionSubmitted")
            .withArgs(0, recipient.address, txAmount);

        // Step 2: Approve the transaction
        await expect(multisig.connect(approver1).approveTransaction(0))
            .to.emit(multisig, "TransactionApproved")
            .withArgs(0, approver1.address);

        await expect(multisig.connect(approver2).approveTransaction(0))
            .to.emit(multisig, "TransactionApproved")
            .withArgs(0, approver2.address);

        // Step 3: Execute the transaction
        await expect(multisig.connect(approver1).executeTransaction(0))
            .to.emit(multisig, "TransactionExecuted")
            .withArgs(0);

        // Step 4: Verify recipient's balance
        const finalBalance = await ethers.provider.getBalance(recipient.address);
        expect(finalBalance).to.be.gt(ethers.utils.parseEther("1.0"));
    });
});
