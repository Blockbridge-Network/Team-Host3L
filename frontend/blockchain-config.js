// Import Web3.js
import Web3 from 'https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js';

// Network configuration
const networkConfig = {
    chainId: '57054', // Blaze network chain ID (420)
    chainName: 'Sonice Blaze Testnet',
    nativeCurrency: {
        name: 'Sonic',
        symbol: 'S',
        decimals: 18
    },
    rpcUrls: ['https://rpc.blaze.soniclabs.com'],
    blockExplorerUrls: ['https://blaze.soniclabs.com']
};

// Blockchain configuration
const blockchainConfig = {
    // Replace with your deployed contract address
    contractAddress: '0xcd90789db24508b7d8a4f62702fdb4448654ec19',
    // Replace with your network RPC URL (e.g., for Sepolia testnet)
    rpcUrl: 'https://rpc.blaze.soniclabs.com',
    // Contract ABI
    contractABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_pricePerYear",
                    "type": "uint256"
                },
                {
                    "internalType": "string[]",
                    "name": "_features",
                    "type": "string[]"
                },
                {
                    "internalType": "string",
                    "name": "_imageURL",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "_available",
                    "type": "bool"
                }
            ],
            "name": "addHostel",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_hostelId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint8",
                    "name": "_rating",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "_comment",
                    "type": "string"
                }
            ],
            "name": "addReview",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_hostelId",
                    "type": "uint256"
                }
            ],
            "name": "approveHostel",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_hostelId",
                    "type": "uint256"
                }
            ],
            "name": "bookHostel",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllBookings",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "hostelId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct HostelBooking.Booking[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAllHostels",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "location",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "pricePerYear",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string[]",
                            "name": "features",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string",
                            "name": "imageURL",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "available",
                            "type": "bool"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct HostelBooking.Hostel[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getAvailableHostels",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "location",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "pricePerYear",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string[]",
                            "name": "features",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string",
                            "name": "imageURL",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "available",
                            "type": "bool"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct HostelBooking.Hostel[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "getHostelByName",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "location",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "pricePerYear",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string[]",
                            "name": "features",
                            "type": "string[]"
                        },
                        {
                            "internalType": "string",
                            "name": "imageURL",
                            "type": "string"
                        },
                        {
                            "internalType": "bool",
                            "name": "available",
                            "type": "bool"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct HostelBooking.Hostel[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "hostelId",
                    "type": "uint256"
                }
            ],
            "name": "getHostelPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyBookings",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "hostelId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "user",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct HostelBooking.Booking[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "registerHostelManager",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_hostelId",
                    "type": "uint256"
                }
            ],
            "name": "rejectHostel",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_newFee",
                    "type": "uint256"
                }
            ],
            "name": "setListingFee",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "verifyUser",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                }
            ],
            "name": "withdrawFunds",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
};

// Initialize Web3
let web3;
let contract;

async function initBlockchain() {
    try {
        // Check if MetaMask is installed
        if (window.ethereum) {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Check if we're on the correct network
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== networkConfig.chainId) {
                try {
                    // Request to switch to Blaze network
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: networkConfig.chainId }],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (switchError.code === 4902) {
                        try {
                            // Add Blaze network to MetaMask
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [networkConfig],
                            });
                        } catch (addError) {
                            console.error('Error adding Blaze network:', addError);
                            throw new Error('Failed to add Blaze network to MetaMask');
                        }
                    } else {
                        throw switchError;
                    }
                }
            }
            
            // Create Web3 instance
            web3 = new Web3(window.ethereum);
            
            // Initialize contract
            contract = new web3.eth.Contract(
                blockchainConfig.contractABI,
                blockchainConfig.contractAddress
            );

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log('Account changed:', accounts[0]);
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Chain changed:', chainId);
                window.location.reload();
            });

            return true;
        } else {
            console.error('Please install MetaMask!');
            return false;
        }
    } catch (error) {
        console.error('Error initializing blockchain:', error);
        return false;
    }
}

// Export blockchain functions
export const blockchain = {
    init: initBlockchain,
    getContract: () => contract,
    getWeb3: () => web3,
    getAccount: async () => {
        const accounts = await web3.eth.getAccounts();
        return accounts[0];
    },
    // Add function to register as a hostel manager
    registerManager: async (name) => {
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.registerHostelManager(name).send({ from: accounts[0] });
            return true;
        } catch (error) {
            console.error('Error registering manager:', error);
            return false;
        }
    },
    // Add function to get user's bookings
    getBookings: async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            return await contract.methods.getMyBookings().call({ from: accounts[0] });
        } catch (error) {
            console.error('Error getting bookings:', error);
            return [];
        }
    },
    // Add function to register user
    registerUser: async (firstName, lastName, email, phone) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const result = await contract.methods.registerUser(
                firstName,
                lastName,
                email,
                phone
            ).send({ from: accounts[0] });
            return result;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }
}; 