// SPDX-License-Identifier: MIT
//tuple(uint256,string)[]: 0,https://gateway.pinata.cloud/ipfs/QmUM2jvm9Ya795JoQMMc652tZgPiygPwfPrUpDmqbN4d6K
//Floor Price: 1000000000000000000
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Calendar2022 is  ERC721URIStorage, Ownable{
    
    string baseURI;

    bool public mintActive = false;
    using Counters for Counters.Counter;

    Counters.Counter private tokenCount;

    address platform;
    address advisor;

    struct NFTData {
        uint tokenId;
        string tokenURI;
        uint price;
        address tokenOwner;
        bool locked;
    }

    NFTData[] nftData;
    mapping(uint => uint) nftPrice;
    mapping(uint => NFTData) nftTokenMap;

    event Minted(address owner, uint numTokens);
    event SetForSale(uint tokenId, uint price);
    event TokenMetadatUpdated(uint tokenId, string updatedTokenURI);
    event Sold(uint tokenId, uint salePrice);
    event OwnershipGranted(address newOwner);

    modifier onlyTokenOwner(uint tokenId) {
        require(msg.sender == ownerOf(tokenId), "Only token owner can call this function");
        _;
    }

    constructor (string memory name,
        string memory symbol,
        string memory baseTokenURI,
        address _advisor
    ) ERC721(name, symbol) {
        baseURI = baseTokenURI;
        mintActive = true;

        platform = msg.sender;
        advisor = _advisor;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view virtual  override returns (string memory) {
        return baseURI;
    }
    /*
        Mint 366 NFTs for the year 2022.
        @dev: Only the onwer can mint
    */
    function mintDate(uint256 tokenId, string memory tokenMetadata, uint floorPrice) public payable {
        tokenCount.increment();
        require(mintActive, "The minting phase is not active");
        require(msg.value >= floorPrice, "The sent value is less than floor price");
        

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenMetadata);
            
        NFTData memory nft = NFTData(tokenId, tokenURI(tokenId), floorPrice, msg.sender, false);
        nftTokenMap[tokenId] = nft;
        nftPrice[tokenId] = floorPrice;
        nftData.push(nft);

        emit Minted(msg.sender, tokenId);
        
    }

    /*
        Set the NFT for sale.
    */
    function setSale(uint tokenId, uint price) public onlyTokenOwner(tokenId){
        require(price > 0, "Price cannot be set to zero");
        nftPrice[tokenId] = price;

        emit SetForSale(tokenId, price);
    }

    /*
        Update the token metadata by settng the new token URI.
    */
    function updateTokenURI(uint tokenId, string memory updatedTokenURI, bool isLocked) public onlyTokenOwner(tokenId){
        NFTData memory nftUpdated = nftTokenMap[tokenId];
        _setTokenURI(tokenId, updatedTokenURI);

        nftUpdated.tokenURI = tokenURI(tokenId);
        nftUpdated.locked = isLocked;

        nftTokenMap[tokenId] = nftUpdated;

        emit TokenMetadatUpdated(tokenId, updatedTokenURI);
    }

    /*
        Buy an NFT which is on sale.
    */
    function buyNft(uint tokenId, address _nftAddress) public payable {
        require(nftPrice[tokenId] > 0, "Token is not for sale");
        require(msg.value >= nftPrice[tokenId], "Price is lower than asking price");

        ERC721 nftAddress = ERC721(_nftAddress);

        address tokenOwner = nftAddress.ownerOf(tokenId);

        nftAddress.safeTransferFrom(tokenOwner, msg.sender, tokenId);

        uint platformFee = (msg.value * 4)/100;
        uint advisorFee = (msg.value * 1)/100;
        uint sellerFee = (msg.value * 95) / 100;
        //Royalty payout - Total 5% (4 for platform, 1 for advisor)
        
        payable(tokenOwner).transfer(sellerFee);
        payable(platform).transfer(platformFee);
        payable(advisor).transfer(advisorFee);

        NFTData memory nftUpdated = nftTokenMap[tokenId];
        nftUpdated.price = 0;
        nftUpdated.tokenOwner = msg.sender;

        nftTokenMap[tokenId] = nftUpdated;

        emit Sold(tokenId, msg.value);

    }

    /*
        Unlocks the locked NFT
    */
    function unLock(uint tokenId) public onlyTokenOwner(tokenId){
        NFTData storage nftUpdated = nftTokenMap[tokenId];
        nftUpdated.locked = false;
    }

    /*
        Withdraw funds present in the contract to the owner.
    */
    function withdrawFunds(address to) public onlyOwner {
        require(address(this).balance > 0, "The contract does not have any balance");
        payable(to).transfer(address(this).balance);
    }

    ///Set the mint status of the contract
    function setMintStatus(bool status) public onlyOwner {
        mintActive = status;
    }

    /* Get the mint status of the contract
    */
    function getMintStatus() external view returns(bool) {
        return mintActive;
    }

    /* 
        Get token count
    */
    function getTokenCount() external view onlyOwner returns(uint) {
        return tokenCount.current();
    }

    /**
    * @dev Owner can transfer the ownership of the contract to a new account (`_grantedOwner`).
    * Can only be called by the current owner.
    */
    function grantContractOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        _transferOwnership(newOwner);
        emit OwnershipGranted(newOwner);
    }

    /*
        Get all the NFTs.
    */
    function getNftData() public view returns(NFTData[] memory)
    {
        NFTData[] memory latestNftData = new NFTData[](tokenCount.current());
        for(uint i = 0; i < nftData.length; i++){
            NFTData storage data = nftTokenMap[nftData[i].tokenId];
            latestNftData[i] = data;
        }

        return latestNftData;
    }

}
