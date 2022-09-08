// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract MyEpicGame {

  struct CharacterAttribute {
    uint characterIndex;
    uint hp;
    uint maxHp;
    uint attackDamage;
    string name;
    string imageURI;
  }

  CharacterAttribute[] defaultCharacters;
  
  constructor(
    // キャラをmintする際の初期化データ(contract作成時に引数で渡す)
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg
  ) {
    // ゲームで扱う全てのキャラをループで呼び、それぞれに付与されるデフォルト値をコントラクトに保存
    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttribute({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDmg[i]
      }));
      CharacterAttribute memory character = defaultCharacters[i];

      // hardhat の console.log() は任意の順で最大4つのパラメータを指定可能
      // 指定できるパラメータ: uint, string, bool, address
      console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
    }
  }
}
