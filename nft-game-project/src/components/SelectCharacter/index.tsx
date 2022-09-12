import { CharacterDataProps } from "../../constants";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../abi/MyEpicGame.json";
import { useEffect, useState } from "react";

const RenderCharacters = ({
  characters,
  mintCharacterNFTAction,
}: {
  characters: CharacterDataProps[];
  mintCharacterNFTAction: (characterId: number) => () => Promise<void>;
}) => {
  return (
    <>
      {characters.map((character, index) => (
        <div className="character-item" key={index.toString()}>
          <div className="name-container">
            <p>{character.name}</p>
          </div>
          <img src={character.imageURI} alt={character.name} />
          <button
            type="button"
            className="character-mint-button"
            onClick={mintCharacterNFTAction(index)}
          >
            {`Mint ${character.name}`}
          </button>
        </div>
      ))}
    </>
  );
};

const SelectCharacter = ({
  setCharacterNFT,
}: {
  setCharacterNFT: React.Dispatch<
    React.SetStateAction<CharacterDataProps | null>
  >;
}) => {
  const [characters, setCharacters] = useState<CharacterDataProps[] | null>(
    null
  );
  const [gameContract, setGameContract] = useState<ethers.Contract | null>(
    null
  );

  const mintCharacterNFTAction = (characterId: number) => async () => {
    try {
      if (gameContract) {
        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
      }
    } catch (err) {
      console.warn("MintCharacterAction Error:", err);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      if (!gameContract) return;
      try {
        console.log("Getting contract characters to mint");
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);
        const characters = charactersTxn.map(
          (characterData: CharacterDataProps) =>
            transformCharacterData(characterData)
        );
        setCharacters(characters);
      } catch (err) {
        console.log("Something went wrong fetching characters:", err);
      }
    };

    const onCharacterMint = async (
      sender: string,
      tokenId: number,
      characterIndex: number
    ) => {
      console.log(
        `CharacterNFTminted - sender: ${sender}, tokenId: ${tokenId}, characterIndex: ${characterIndex}`
      );
      if (gameContract) {
        const characterNFT = await gameContract.chechIfUserHasNFT();
        console.log("CharacterNFT:", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
        // TODO: Goerli
        alert(
          `NFT キャラクーが Mint されました -- リンクはこちらです: https://rinkeby.rarible.com/token/${gameContract.address}:${tokenId}?tab=details`
        );
      }
    };

    if (gameContract) {
      getCharacters();
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract, setCharacters, setCharacterNFT]);

  return (
    <div className="select-character-container">
      <h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
      {characters && characters.length > 0 && (
        <div className="character-grid">
          <RenderCharacters
            characters={characters}
            mintCharacterNFTAction={mintCharacterNFTAction}
          />
        </div>
      )}
    </div>
  );
};
export default SelectCharacter;
