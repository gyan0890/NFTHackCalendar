// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Calendar2022 is  ERC721URIStorage, Ownable{
    
    string baseURI;

    //Set it to 366 for 2022
    uint constant MAX_DATES = 1;
    bool mintActive = false;

    address platform;
    address advisor;

    struct NFTData {
        uint tokenId;
        string tokenURI;

        //Q to Vkas: Can we add these to the tokenURI?
        // string month;
        // uint8 day;
    }

    NFTData[] nftData;
    mapping(uint => uint) nftPrice;
    mapping(uint => NFTData) nftTokenMap;

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
    /*
        Mint 366 NFTs for the year 2022.
        @dev: Only the onwer can mint
    */
    function mintAndSellDates(string[] memory tokenURI) public onlyOwner {
        require(mintActive, "The NFTs have already been minted");
        require(tokenURI.length >= MAX_DATES, "Token URI missing");
        for(uint i = 0; i < MAX_DATES; i++) {
            uint mintIndex = i;
            _safeMint(msg.sender, mintIndex);
            _setTokenURI(mintIndex, tokenURI[i]);
            
            NFTData memory nft = NFTData(mintIndex, tokenURI[i]);
            nftTokenMap[mintIndex] = nft;
            nftData.push(nft);
        }

        mintActive = false;
        
    }

    /*
        Set the NFT for sale.
    */
    function setSale(uint tokenId, uint price) public onlyTokenOwner(tokenId){
        require(price > 0, "Price cannot be set to zero");
        nftPrice[tokenId] = price;
    }

    /*
        Update the token metadata by settng the new token URI.
    */
    function updateTokenURI(uint tokenId, string memory updatedTokenURI) public onlyTokenOwner(tokenId){
        NFTData storage nftUpdated = nftTokenMap[tokenId];
        _setTokenURI(tokenId, updatedTokenURI);
        nftUpdated.tokenURI = updatedTokenURI;

    }

    /*
        Buy an NFT which is on sale.
    */
    function buyNft(uint tokenId) public payable {
        require(_exists(tokenId), "Token ID does not exist");
        require(nftPrice[tokenId] > 0, "Token is not for sale");
        require(msg.value >= nftPrice[tokenId], "Price is lower than asking price");


        address owner = ownerOf(tokenId);

        safeTransferFrom(owner, msg.sender, tokenId);

        uint platformFee = (msg.value * 4)/100;
        uint advisorFee = (msg.value * 1)/100;
        uint sellerFee = (msg.value * 95) / 100;
        //Royalty payout - Total 5% (4 for platform, 1 for advisor)
        
        payable(owner).transfer(sellerFee);
        payable(platform).transfer(platformFee);
        payable(advisor).transfer(advisorFee);

    }

    /*
        Get all the NFTs.
    */
    function getNftData() public view returns(NFTData[] memory)
    {
        return nftData;
    }

}


