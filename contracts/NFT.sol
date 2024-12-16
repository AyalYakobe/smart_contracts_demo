// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address _admin) ERC721("NFTCollection", "NFTC") {
        admin = _admin;
    }

    function mint(address to, uint256 tokenId, string memory tokenURI) public onlyAdmin {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function setAdmin(address _admin) public onlyAdmin {
        admin = _admin;
    }
}
