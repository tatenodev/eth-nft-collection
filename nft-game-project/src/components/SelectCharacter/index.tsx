import { CharacterDataProps } from "../../constants";
import "./SelectCharacter.css";

const SelectCharacter = ({
  setCharacterNFT,
}: {
  setCharacterNFT: React.Dispatch<
    React.SetStateAction<CharacterDataProps | null>
  >;
}) => {
  return (
    <div className="select-character-container">
      <h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
    </div>
  );
};
export default SelectCharacter;
