// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {
    using Strings for uint256;

    constructor(
        string memory _name,
        string memory _symbol,
        address initialOwner
    ) ERC721(_name, _symbol) Ownable(initialOwner) {}

    uint public nextTokenId;
    uint public itemCount;

    struct Item {
        uint itemId;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // tokenId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    function mintNFT(
        string memory _tokenURI,
        uint256 _price
    ) external onlyOwner returns (uint) {
        uint256 tokenId = nextTokenId;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        // Set the price for the minted NFT
        items[tokenId] = Item(
            tokenId,
            tokenId,
            _price,
            payable(msg.sender),
            false
        );

        nextTokenId++;

        return tokenId;
    }

    function listNFT(uint256 tokenId, uint _price) external {
        require(_price > 0, "Price must be greater than zero");
        approve(address(this), tokenId);
        transferFrom(msg.sender, address(this), tokenId);

        // increment itemCount
        itemCount = tokenId;

        // add new item to items mapping
        items[tokenId] = Item(
            tokenId,
            tokenId,
            _price,
            payable(msg.sender),
            false
        );

        // emit Offered event
        emit Offered(tokenId, tokenId, _price, msg.sender);
    }

    function purchaseNFT(uint256 tokenId) external payable {
        require(msg.value >= items[tokenId].price, "Insufficient payment");
        Item storage item = items[tokenId];
        require(item.tokenId > 0, "Item doesn't exist");
        require(!item.sold, "Item is already sold");
        address seller = ownerOf(item.tokenId);
        transferFrom(address(this), msg.sender, item.tokenId);
        payable(seller).transfer(msg.value);
        item.sold = true;
        emit Bought(
            item.itemId,
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }
}
