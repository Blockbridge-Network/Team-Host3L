// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HostelNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Structure to store hostel details
    struct Hostel {
        string name;
        string location;
        uint256 totalValue;
        uint256 totalTokens;
        uint256 tokenPrice;
        address manager;
        bool isActive;
        uint256 totalRevenue;
        uint256 lastDistributionTimestamp;
    }

    // Structure to store investor details
    struct Investor {
        uint256 tokenBalance;
        uint256 lastClaimTimestamp;
        uint256 unclaimedDividends;
    }

    // Mapping from token ID to Hostel
    mapping(uint256 => Hostel) public hostels;
    
    // Mapping from hostel ID to its investment token contract
    mapping(uint256 => HostelToken) public hostelTokens;
    
    // Mapping from hostel ID to investor address to their details
    mapping(uint256 => mapping(address => Investor)) public investors;
    
    // Mapping to track verified hostel managers
    mapping(address => bool) public verifiedManagers;
    
    // Mapping to track revenue shares for each hostel
    mapping(uint256 => uint256) public revenueShares;

    // Events
    event HostelCreated(uint256 indexed tokenId, string name, address manager);
    event InvestmentMade(uint256 indexed hostelId, address investor, uint256 amount);
    event DividendsDistributed(uint256 indexed hostelId, uint256 amount);
    event ManagerVerified(address manager);
    event ManagerRemoved(address manager);
    event RevenueAdded(uint256 indexed hostelId, uint256 amount);
    event OwnershipTransferred(uint256 indexed hostelId, address newManager);

    // Modifier to check if caller is a verified manager
    modifier onlyVerifiedManager() {
        require(verifiedManagers[msg.sender], "Not a verified manager");
        _;
    }

    // Modifier to check if hostel is active
    modifier onlyActiveHostel(uint256 hostelId) {
        require(hostels[hostelId].isActive, "Hostel is not active");
        _;
    }

    constructor() ERC721("HostelNFT", "HNFT") Ownable(msg.sender) {}

    // Function to verify a hostel manager (only owner can do this)
    function verifyManager(address manager) external onlyOwner {
        verifiedManagers[manager] = true;
        emit ManagerVerified(manager);
    }

    // Function to remove a hostel manager (only owner can do this)
    function removeManager(address manager) external onlyOwner {
        verifiedManagers[manager] = false;
        emit ManagerRemoved(manager);
    }

    // Function to create a new hostel NFT (only verified managers)
    function createHostel(
        string memory name,
        string memory location,
        uint256 totalValue,
        uint256 totalTokens,
        uint256 tokenPrice
    ) external onlyVerifiedManager returns (uint256) {
        require(totalValue > 0 && totalTokens > 0 && tokenPrice > 0, "Invalid parameters");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Create new hostel token contract
        HostelToken newToken = new HostelToken(
            string(abi.encodePacked(name, " Token")),
            string(abi.encodePacked("H", name)),
            totalTokens
        );

        // Store hostel details
        hostels[newTokenId] = Hostel({
            name: name,
            location: location,
            totalValue: totalValue,
            totalTokens: totalTokens,
            tokenPrice: tokenPrice,
            manager: msg.sender,
            isActive: true,
            totalRevenue: 0,
            lastDistributionTimestamp: block.timestamp
        });

        hostelTokens[newTokenId] = newToken;
        
        // Mint NFT to manager
        _mint(msg.sender, newTokenId);

        emit HostelCreated(newTokenId, name, msg.sender);
        return newTokenId;
    }

    // Function to invest in a hostel
    function invest(uint256 hostelId, uint256 amount) external payable nonReentrant onlyActiveHostel(hostelId) {
        require(msg.value >= amount * hostels[hostelId].tokenPrice, "Insufficient payment");
        require(hostelTokens[hostelId].balanceOf(address(this)) >= amount, "Not enough tokens");
        
        hostelTokens[hostelId].transfer(msg.sender, amount);
        investors[hostelId][msg.sender].tokenBalance += amount;
        
        emit InvestmentMade(hostelId, msg.sender, amount);
    }

    // Function to add revenue to a hostel (only manager)
    function addRevenue(uint256 hostelId) external payable onlyActiveHostel(hostelId) {
        require(msg.sender == hostels[hostelId].manager && msg.value > 0, "Invalid revenue");
        
        hostels[hostelId].totalRevenue += msg.value;
        revenueShares[hostelId] += msg.value;
        
        emit RevenueAdded(hostelId, msg.value);
    }

    // Function to distribute dividends to investors
    function distributeDividends(uint256 hostelId) external nonReentrant onlyActiveHostel(hostelId) {
        uint256 revenueToDistribute = revenueShares[hostelId];
        require(revenueToDistribute > 0, "No revenue to distribute");
        
        hostels[hostelId].lastDistributionTimestamp = block.timestamp;
        revenueShares[hostelId] = 0;
        
        uint256 totalTokens = hostels[hostelId].totalTokens;
        for (uint256 i = 0; i < totalTokens; i++) {
            address investor = hostelTokens[hostelId].tokenHolders(i);
            uint256 balance = hostelTokens[hostelId].balanceOf(investor);
            if (balance > 0) {
                investors[hostelId][investor].unclaimedDividends += (revenueToDistribute * balance) / totalTokens;
            }
        }
        
        emit DividendsDistributed(hostelId, revenueToDistribute);
    }

    // Function to claim dividends
    function claimDividends(uint256 hostelId) external nonReentrant {
        uint256 amount = investors[hostelId][msg.sender].unclaimedDividends;
        require(amount > 0, "No dividends to claim");
        
        investors[hostelId][msg.sender].unclaimedDividends = 0;
        investors[hostelId][msg.sender].lastClaimTimestamp = block.timestamp;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }

    // Function to transfer hostel management (only current manager)
    function transferManagement(uint256 hostelId, address newManager) external {
        require(msg.sender == hostels[hostelId].manager && verifiedManagers[newManager], "Invalid transfer");
        
        hostels[hostelId].manager = newManager;
        emit OwnershipTransferred(hostelId, newManager);
    }

    // Function to get hostel details
    function getHostelDetails(uint256 hostelId) external view returns (
        string memory name,
        string memory location,
        uint256 totalValue,
        uint256 totalTokens,
        uint256 tokenPrice,
        address manager,
        bool isActive,
        uint256 totalRevenue
    ) {
        Hostel storage hostel = hostels[hostelId];
        return (
            hostel.name,
            hostel.location,
            hostel.totalValue,
            hostel.totalTokens,
            hostel.tokenPrice,
            hostel.manager,
            hostel.isActive,
            hostel.totalRevenue
        );
    }

    // Function to get investor details
    function getInvestorDetails(uint256 hostelId, address investor) external view returns (
        uint256 tokenBalance,
        uint256 lastClaimTimestamp,
        uint256 unclaimedDividends
    ) {
        Investor storage investorInfo = investors[hostelId][investor];
        return (
            investorInfo.tokenBalance,
            investorInfo.lastClaimTimestamp,
            investorInfo.unclaimedDividends
        );
    }
}

// Investment token contract for each hostel
contract HostelToken is ERC20 {
    using Counters for Counters.Counter;
    Counters.Counter private _holderIds;
    
    mapping(uint256 => address) public tokenHolders;
    mapping(address => bool) public isHolder;
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }
    
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._update(from, to, amount);
        
        if (to != address(0) && !isHolder[to]) {
            _holderIds.increment();
            tokenHolders[_holderIds.current()] = to;
            isHolder[to] = true;
        }
    }
} 