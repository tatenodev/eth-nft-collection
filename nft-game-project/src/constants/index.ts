export type CharacterDataProps = {
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
};

export const CONTRACT_ADDRESS = "0xF320867695a5b8Da91958eB96dfe432d7c667e2e";
export const transformCharacterData = (characterData: CharacterDataProps) => {
  const { name, imageURI, hp, maxHp, attackDamage } = characterData;
  return {
    name,
    imageURI,
    hp,
    maxHp,
    attackDamage,
  };
};
