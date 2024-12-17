import { BrowserProvider } from "ethers"; // Import BrowserProvider for ethers v6
import { useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  // Connect Wallet Function
  const connectWallet = async () => {
    console.log("Connect Wallet clicked");

    // Step 1: Check if MetaMask is available
    if (typeof window !== "undefined" && window.ethereum) {
      console.log("MetaMask detected");

      try {
        // Step 2: Create provider using ethers v6 BrowserProvider
        const provider = new BrowserProvider(window.ethereum);
        console.log("Provider created");

        // Step 3: Request wallet access
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log("Wallet access requested:", accounts);

        // Step 4: Retrieve the signer and wallet address
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Wallet Address:", address);

        setWalletAddress(address); // Update state with wallet address
      } catch (error) {
        console.error("Error connecting wallet:", error.message);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      // Step 5: If MetaMask is not detected
      console.error("MetaMask not detected");
      alert("MetaMask not detected. Please install MetaMask to use this feature.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>NFT Marketplace</h1>
      <p>Connect your wallet to start using the app.</p>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Connect Wallet
      </button>
      {walletAddress && (
        <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>
          Connected Address: <strong>{walletAddress}</strong>
        </p>
      )}
    </div>
  );
}
