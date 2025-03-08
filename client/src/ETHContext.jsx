import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const ETHContext = createContext();

export const ETHProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        const signer = await web3Provider.getSigner();
        const address = await signer.getAddress();

        setProvider(web3Provider);
        setSigner(signer);
        setWalletAddress(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet.');
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          const signer = await web3Provider.getSigner();
          const address = await signer.getAddress();
          setProvider(web3Provider);
          setSigner(signer);
          setWalletAddress(address);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <ETHContext.Provider value={{ provider, signer, walletAddress, connectWallet }}>
      {children}
    </ETHContext.Provider>
  );
};