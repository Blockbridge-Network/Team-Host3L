// web3-config.js
const Web3 = require('web3');

// Utility functions
const web3Utils = {
    web3: null,
    contract: null,

    // Initialize Web3
    async initializeWeb3() {
        if (window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ 
                    method: 'eth_requestAccounts',
                    params: [] 
                });
                
                // Create Web3 instance
                this.web3 = new Web3(window.ethereum);
                
                // Set up event listeners
                this.setupEventListeners();
                
                return true;
            } catch (error) {
                if (error.code === 4001) {
                    throw new Error("Please connect your MetaMask wallet to continue");
                } else {
                    console.error("User denied account access:", error);
                    throw new Error("Failed to connect to MetaMask");
                }
            }
        } else {
            throw new Error("Please install MetaMask to use this feature");
        }
    },

    // Get current account
    async getCurrentAccount() {
        if (!this.web3) {
            throw new Error("Web3 not initialized");
        }
        const accounts = await this.web3.eth.getAccounts();
        if (accounts.length === 0) {
            throw new Error("No accounts found. Please connect your MetaMask wallet.");
        }
        return accounts[0];
    },

    // Check if user is connected
    async isConnected() {
        if (!this.web3) {
            return false;
        }
        try {
            const accounts = await this.web3.eth.getAccounts();
            return accounts.length > 0;
        } catch (error) {
            console.error('Connection check error:', error);
            return false;
        }
    },

    // Connect wallet
    async connectWallet() {
        if (!window.ethereum) {
            throw new Error("Please install MetaMask to use this feature");
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts',
                params: []
            });

            if (accounts.length === 0) {
                throw new Error("No accounts found. Please connect your MetaMask wallet.");
            }

            // Initialize Web3 if not already initialized
            if (!this.web3) {
                this.web3 = new Web3(window.ethereum);
            }

            // Set up event listeners
            this.setupEventListeners();

            return accounts[0];
        } catch (error) {
            if (error.code === 4001) {
                throw new Error("Please connect your MetaMask wallet to continue");
            } else {
                console.error('Wallet connection error:', error);
                throw new Error("Failed to connect wallet. Please try again.");
            }
        }
    },

    // Setup event listeners
    setupEventListeners() {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    // User disconnected their wallet
                    this.handleDisconnect();
                } else {
                    // User switched accounts
                    this.handleAccountChange(accounts[0]);
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                // Reload the page when the chain changes
                window.location.reload();
            });

            window.ethereum.on('disconnect', () => {
                this.handleDisconnect();
            });
        }
    },

    // Handle wallet disconnection
    handleDisconnect() {
        localStorage.removeItem('connectedAccount');
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
    },

    // Handle account change
    handleAccountChange(newAccount) {
        localStorage.setItem('connectedAccount', newAccount);
        window.dispatchEvent(new CustomEvent('accountChanged', { 
            detail: { account: newAccount } 
        }));
    },

    // Get network information
    async getNetworkInfo() {
        if (!this.web3) {
            throw new Error("Web3 not initialized");
        }
        try {
            const chainId = await this.web3.eth.getChainId();
            const networkId = await this.web3.eth.net.getId();
            
            const networks = {
                1: 'Ethereum Mainnet',
                3: 'Ropsten Testnet',
                4: 'Rinkeby Testnet',
                5: 'Goerli Testnet',
                42: 'Kovan Testnet',
                1337: 'Local Network'
            };

            return {
                chainId,
                networkId,
                networkName: networks[networkId] || 'Unknown Network'
            };
        } catch (error) {
            console.error('Network info error:', error);
            throw new Error('Failed to get network information');
        }
    },

    // Check if connected to the correct network
    async checkNetwork() {
        const networkInfo = await this.getNetworkInfo();
        // Replace with your desired network ID
        const desiredNetworkId = 5; // Goerli Testnet
        
        if (networkInfo.networkId !== desiredNetworkId) {
            try {
                // Try to switch to the correct network
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x5' }], // Goerli Testnet
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x5',
                                chainName: 'Goerli Testnet',
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                rpcUrls: ['https://goerli.infura.io/v3/'],
                                blockExplorerUrls: ['https://goerli.etherscan.io']
                            }]
                        });
                    } catch (addError) {
                        throw new Error('Failed to add Goerli Testnet to MetaMask');
                    }
                } else {
                    throw new Error('Failed to switch to Goerli Testnet');
                }
            }
        }
        return true;
    }
};

export default web3Utils;