// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    address public admin;

    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function listNFT(address nftContract, uint256 tokenId, uint256 price) public {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.isApprovedForAll(msg.sender, address(this)), "Marketplace not approved");

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price
        });
    }

    function buyNFT(address nftContract, uint256 tokenId) public payable {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.price > 0, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        delete listings[nftContract][tokenId];

        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);
        payable(listing.seller).transfer(listing.price);
    }
}
