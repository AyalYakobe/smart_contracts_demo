import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACTS, getContract } from "../lib/contracts";

export default function ListTransaction() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const submitTransaction = async () => {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = provider.getSigner();
    const contract = getContract(CONTRACTS.MULTISIG.address, CONTRACTS.MULTISIG.abi, signer);

    const tx = await contract.submitTransaction(recipient, ethers.utils.parseEther(amount), "0x");
    await tx.wait();
    alert("Transaction submitted!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Submit Transaction</h1>
      <input
        type="text"
        placeholder="Recipient Address"
        className="border p-2"
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        className="border p-2 mt-2"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={submitTransaction}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Submit Transaction
      </button>
    </div>
  );
}
