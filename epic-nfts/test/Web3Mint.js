const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Web3Mint", () => {
  it("Should return the nft", async () => {
    const Mint = await ethers.getContractFactory("Web3Mint");
    const mintContract = await Mint.deploy();
    await mintContract.deployed();

    const [owner, addr1] = await ethers.getSigners();

    let nftName = 'poker';
    let ipfsCID = 'bafybeihvxvr7gmv7gei3q3kcoaqx2wjw6aoiqj2bfmj4o7jczhqbovs7ii';

    await mintContract.connect(owner).mintIpfsNFT(nftName, ipfsCID);
    await mintContract.connect(addr1).mintIpfsNFT(nftName, ipfsCID);

    console.log(await mintContract.tokenURI(0));
    console.log(await mintContract.tokenURI(1));
  });
});
