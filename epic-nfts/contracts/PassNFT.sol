// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "./lib/Base64.sol";

contract PassNFT is ERC721URIStorage {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  string constant REALITY = "Gold";
  
  constructor() ERC721 ("TestPassNFT", "PASSNFT") {
    console.log("This is my Pass NFT contract.");
  }

  function createPassIdSVG() internal view returns(string memory) {
    string memory startTag = "<text style='white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 18.3px;' x='139.493' y='216.765'>PassID: ";
    // string memory tokenId = string(abi.encodePacked(_tokenIds.current()));
    string memory tokenId = Strings.toString(_tokenIds.current());
    string memory endTag = "</text>";

    return string(abi.encodePacked(startTag, tokenId, endTag));
  }

  function createReality(string memory rank) internal pure returns(string memory) {
    string memory startTag = "<text style='white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 18.3px;' x='140.972' y='244.607'>Reality: ";
    string memory endTag = "</text>";

    return string(abi.encodePacked(startTag, rank, endTag));
  }

  function createAddressSVG() internal view returns(string memory) {
    string memory tagA = "<path id='text-line' d='M 115.897 167.294 H 317.489 A 6.267 6.267 0 0 1 323.756 173.561 V 316.969 A 6.267 6.267 0 0 1 317.489 323.236 H 115.897 A 6.267 6.267 0 0 1 109.63 316.969 V 173.561 A 6.267 6.267 0 0 1 115.897 167.294 Z' style='fill: none;'/><text><textPath href='#text-line' font-size='22px' fill='green'>";
    string memory tagB = "<animate attributeName='startOffset' from='-50%' to ='50%' begin='0s' dur='10s' repeatCount='indefinite' keyTimes='0;1' keySplines='0.1 0.2 .22 1'/></textPath><textPath href='#text-line' font-size='22px' fill='green'>";
    string memory tagC = "<animate attributeName='startOffset' from='50%' to ='150%' begin='0s' dur='10s' repeatCount='indefinite' keyTimes='0;1' keySplines='0.1 0.2 .22 1'/></textPath></text>";
    string memory _address = Strings.toHexString(msg.sender);

    return string(abi.encodePacked(tagA, _address, tagB, _address, tagC));
  }

  function createPassSVG() internal view returns (string memory) {
    string memory startTag = "<svg viewBox='92.418 107.735 249.85 249.85' xmlns='http://www.w3.org/2000/svg'><rect x='92.418' y='107.735' width='249.85' height='249.85' style='fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);'/><text style='white-space: pre; fill: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 18.3px;' x='171.481' y='139.052'>NFT Pass</text>";
    string memory endTag = "</svg>";
    string memory passId = createPassIdSVG();
    string memory rank = createReality(REALITY);
    string memory _address = createAddressSVG();

    return string(abi.encodePacked(startTag, passId, rank, _address, endTag));
  }

  function makeAnEpicNFT() public {
    uint256 newItemId = _tokenIds.current();
    string memory nameForNft = string(abi.encodePacked("PassNFT #", Strings.toString(newItemId)));
    string memory finalSvg = createPassSVG();

    console.log("\n--------------------");
    console.log(finalSvg);
    console.log("--------------------\n");

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            nameForNft,
            '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(finalSvg)),
            '"}'
          )
        )
      )
    );

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n----- Token URI (PassNFT) ----");
    console.log(finalTokenUri);
    console.log("--------------------\n");

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, finalTokenUri);
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    _tokenIds.increment();
  }
}
