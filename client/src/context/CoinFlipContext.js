import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contractDetails";

//--- Fetch smart Contract
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(contractAddress, contractABI, signerOrProvider);

//--- connect with smart contract
const connectWithSmartContract = () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    return contract;
  } catch (err) {
    console.log("Something went wrong while connecting with contract");
  }
};

export const CoinFlipContext = React.createContext();

export const CoinFlipProvider = ({ children }) => {
  //--- useStates
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);

  const sendEtherToContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = {
        to: contract.address,
        value: ethers.utils.parseEther("0.2"), // Amount of Ether to send
        gasLimit: 3000000, // Set a higher gas limit if needed
      };
      
      console.log(contract.address);
      
      const transactionResponse = await signer.sendTransaction(tx);
      await transactionResponse.wait(); // Wait for the transaction to be mined

      console.log("Transaction successful:", transactionResponse);
    } catch (error) {
      console.error("Error sending Ether to contract:", error);
    }
  };

  //--- check if wallet is connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        alert("Please Install MetaMask");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      if (accounts.length) {
        setAccount(accounts[0]);
        getBalance(accounts[0]); // Fetch balance when wallet is connected
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("Something went wrong while connecting to wallet");
    }
  };

  //--- Function to connect with wallet
  const connectwallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please Install MetaMask");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      getBalance(accounts[0]); // Fetch balance when wallet is connected
    } catch (err) {
      console.log("Error while connecting with wallet");
    }
  };

  //--- Function to get account balance
  const getBalance = async (account) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setBalance(ethers.utils.formatEther(balance)); // Convert balance from wei to ether
    } catch (error) {
      console.log("Error while fetching balance:", error);
    }
  };

  useEffect(() => {
    const contract = connectWithSmartContract();
    setContract(contract);
  }, []);

  return (
    <CoinFlipContext.Provider
      value={{
        contract,
        account,
        balance, // Provide balance in context
        checkIfWalletConnected,
        connectwallet,
        sendEtherToContract,
      }}
    >
      {children}
    </CoinFlipContext.Provider>
  );
};
