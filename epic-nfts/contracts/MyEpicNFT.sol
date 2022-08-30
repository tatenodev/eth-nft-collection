// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract MyEpicNFT is ERC721URIStorage {
  // OpenZeppelin が tokenIds を簡単に追跡するために提供するライブラリを呼び出し
  // トラッキングの際に起こりうるオーバーフローを防ぐ
  using Counters for Counters.Counter;

  // _tokenIds を初期化(_tokenIds = 0)
  Counters.Counter private _tokenIds;
  
  // NFTトークンの名前とそのシンボルを渡す
  constructor() ERC721 ("TanyaNFT", "TANYA") {
    console.log("This is my NFT contract.");
  }

  // ユーザーが NFT を取得するために実行する関数
  function makeAnEpicNFT() public {
    // 現在のtokenIdを取得。tokenIdは0から始まる。
    uint256 newItemId = _tokenIds.current();

    // msg.sender を使って NFT を送信者に Mint する
    _safeMint(msg.sender, newItemId);

    // NFT データを設定
    _setTokenURI(newItemId, "https://jsonkeeper.com/b/6FK1");

    // NFT がいつ誰に作成されたかを確認
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    // 次の NFT が Mint されるときのカウンターをインクリメント
    _tokenIds.increment();
  }
}
