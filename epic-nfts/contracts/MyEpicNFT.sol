// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MyEpicNFT is ERC721URIStorage {
  // OpenZeppelin が tokenIds を簡単に追跡するために提供するライブラリを呼び出し
  // トラッキングの際に起こりうるオーバーフローを防ぐ
  using Counters for Counters.Counter;

  // _tokenIds を初期化(_tokenIds = 0)
  Counters.Counter private _tokenIds;

  // SVGコード生成。変更されるのは表示される単語のみ。
  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  string[] firstWords = ["Red", "Blue", "Yellow", "Brown", "Black", "White"];
  string[] secondWords = ["Apricot", "Strawberry", "Watermelon", "Pineapple", "Banana", "Peach"];
  string[] thirdWords = ["Mercury", "Venus", "Mars", "Jupiter", "Uranus", "Neptune"];
  
  // NFTトークンの名前とそのシンボルを渡す
  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract.");
  }

  // シードを生成する
  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }

  // 各配列からランダムに単語を選ぶ関数3つ
  function pickRnadomFirstWord(uint256 tokenId) public view returns (string memory) {
    // pickRandomFirstWord関数のシードとなるrandを作成
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
    console.log("rand seed: ", rand);
    // firstWords配列の長さを基準にrand番目の単語を選ぶ
    rand = rand % firstWords.length;
    console.log("rand first word: ", rand);
    return firstWords[rand];
  }

  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  // ユーザーが NFT を取得するために実行する関数
  function makeAnEpicNFT() public {
    // 現在のtokenIdを取得。tokenIdは0から始まる。
    uint256 newItemId = _tokenIds.current();

    // 3つの配列からそれぞれ1つの単語をランダムに取り出す
    string memory first = pickRnadomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);

    // 3つの単語を連結してtextタグとsvgタグで閉じる
    string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));

    console.log("\n--------------------");
    console.log(finalSvg);
    console.log("--------------------\n");

    // msg.sender を使って NFT を送信者に Mint する
    _safeMint(msg.sender, newItemId);

    // NFT データを設定
    // off chain
    // _setTokenURI(newItemId, "https://jsonkeeper.com/b/6FK1");
    // on chain
    // _setTokenURI(
    //   newItemId,
    //   "data:application/json;base64,ewogICJuYW1lIjogIkVwaWNOZnRDcmVhdG9yIiwKICAiZGVzY3JpcHRpb24iOiAiVGhlIGhpZ2hseSBhY2NsYWltZWQgc3F1YXJlIGNvbGxlY3Rpb24iLAogICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0S0lDQWdJRHh6ZEhsc1pUNHVZbUZ6WlNCN0lHWnBiR3c2SUhkb2FYUmxPeUJtYjI1MExXWmhiV2xzZVRvZ2MyVnlhV1k3SUdadmJuUXRjMmw2WlRvZ01UUndlRHNnZlR3dmMzUjViR1UrQ2lBZ0lDQThjbVZqZENCM2FXUjBhRDBpTVRBd0pTSWdhR1ZwWjJoMFBTSXhNREFsSWlCbWFXeHNQU0ppYkdGamF5SWdMejRLSUNBZ0lEeDBaWGgwSUhnOUlqVXdKU0lnZVQwaU5UQWxJaUJqYkdGemN6MGlZbUZ6WlNJZ1pHOXRhVzVoYm5RdFltRnpaV3hwYm1VOUltMXBaR1JzWlNJZ2RHVjRkQzFoYm1Ob2IzSTlJbTFwWkdSc1pTSStSWEJwWTA1bWRFTnlaV0YwYjNJOEwzUmxlSFErQ2p3dmMzWm5QZz09Igp9"
    // );
    // TODO: あとで設定
    _setTokenURI(newItemId, "We will set tokenURI later.");

    // NFT がいつ誰に作成されたかを確認
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    // 次の NFT が Mint されるときのカウンターをインクリメント
    _tokenIds.increment();
  }
}
