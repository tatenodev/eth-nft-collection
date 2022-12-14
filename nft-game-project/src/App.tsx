import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import SelectCharacter from "./components/SelectCharacter";
import {
  CharacterDataProps,
  CONTRACT_ADDRESS,
  transformCharacterData,
} from "./constants";
import myEpicGame from "./abi/MyEpicGame.json";
import Arena from "./components/Arena";

const TWITTER_HANDLE = "tatenodev";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const RenderContent = ({
  currentAccount,
  characterNFT,
  setCharacterNFT,
  connectWalletAction,
}: {
  currentAccount: string | null;
  characterNFT: CharacterDataProps | null;
  setCharacterNFT: React.Dispatch<
    React.SetStateAction<CharacterDataProps | null>
  >;
  connectWalletAction: () => Promise<void>;
}) => {
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img src="https://i.imgur.com/TXBQ4cC.png" alt="LUFFY" />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet to Get Started
        </button>
      </div>
    );
  }
  if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  }
  if (currentAccount && characterNFT) {
    return (
      <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    );
  }

  return <></>;
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [characterNFT, setCharacterNFT] = useState<CharacterDataProps | null>(
    null
  );

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== 5) {
        return alert("Goerli Test Network に接続してください");
      }
      console.log("Goerli に接続されています。");
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return console.log("Make sure you have MetaMask");

      console.log("We have the ethereum object", ethereum);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("account:", account);
        setCurrentAccount(account);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return alert("Get MetaMask!");

      checkIfWalletIsConnected();

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      checkNetwork();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.chechIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
    };

    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚡️ METAVERSE GAME ⚡️</p>
          <p className="sub-text">プレイヤーと協力してボスを倒そう✨</p>
          <RenderContent
            currentAccount={currentAccount}
            characterNFT={characterNFT}
            setCharacterNFT={setCharacterNFT}
            connectWalletAction={connectWalletAction}
          />
        </div>
        <div className="footer-container">
          <img
            alt="Twitter Logo"
            className="twitter-logo"
            src="/twitter-logo.svg"
          />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
