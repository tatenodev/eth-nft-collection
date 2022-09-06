const main = async () => {
  const [owner, randomPerson] = await ethers.getSigners();
  const nftContractFactory = await hre.ethers.getContractFactory("PassNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to: ", nftContract.address);

  let txn = await nftContract.connect(randomPerson).makeAnEpicNFT();
  await txn.wait();
  txn = await nftContract.connect(randomPerson).makeAnEpicNFT();
  await txn.wait();
};

// error処理
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();
