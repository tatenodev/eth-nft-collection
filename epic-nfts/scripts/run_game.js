const main = async() => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy();
  const nftGame = await gameContract.deployed();

  console.log("Contract deployed to:" , nftGame.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
}

runMain();
