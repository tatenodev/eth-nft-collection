import React, { useEffect, useState } from "react";
import "./App.css";

// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const TWITTER_HANDLE = "tatenodev";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

type RenderNotConnectedContainerProps = {
  account: string;
  connectWallet: React.MouseEventHandler<HTMLButtonElement>;
};

const RenderNotConnectedContainer = ({
  account,
  connectWallet,
}: RenderNotConnectedContainerProps) => {
  return account ? (
    <button className="cta-button connect-wallet-button">Mint NFT</button>
  ) : (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
};

const App = () => {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) return;
    const account = accounts[0];
    setCurrentAccount(account);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Get MetaMask!");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">あなただけの特別な NFT を Mint しよう💫</p>
          <RenderNotConnectedContainer
            account={currentAccount}
            connectWallet={connectWallet}
          />
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
