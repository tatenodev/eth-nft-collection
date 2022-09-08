import { ethers } from "ethers";
import Web3Mint from "../abi/web3mint.json";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import { Web3Storage } from "web3.storage";
import { Web3File } from "web3.storage/dist/src/lib/interface";

const NftUploader = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async (ipfs: Web3File["cid"]) => {
    const CONTRACT_ADDRESS = "0x35558364D864EAAcE19c10d84437969F133eDf12";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU4MTQxMmVkYTk5NUI5NjMzMDIwNTYxRDkzMTRhNGE5NEQyMDIyNTQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDkzMTE5NzIxNjYsIm5hbWUiOiJzYW1wbGUifQ.1q2qbS-4FgjREAr_wVE0QtRI68QLEfPQdPO-B-7ixjg";

  const imageToNFT = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const client = new Web3Storage({ token: API_KEY });
    const image = e.target;

    console.log(image);
    if (!image.files) return;

    const rootCid = await client.put(image.files, {
      name: "experiment",
      maxRetries: 3,
    });

    const res = await client.get(rootCid); // Web3Response
    if (!res) return console.log("response is null");

    const files = await res.files(); // Web3File[]
    for (const file of files) {
      console.log("file.cid:", file.cid);
      askContractToMintNft(file.cid);
    }
  };

  return (
    <div className="outerBox">
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input
          className="nftUploadInput"
          multiple
          name="imageURL"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input
          className="nftUploadInput"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </Button>
    </div>
  );
};

export default NftUploader;
