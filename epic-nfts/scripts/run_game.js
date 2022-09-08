const main = async() => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["ZORO", "NAMI", "USOPP"], //character name
    [
      "https://i.imgur.com/TZEhCTX.png", // character image
      "https://i.imgur.com/WVAaMPA.png",
      "https://i.imgur.com/pCMZeiM.png",
    ],
    [100, 200, 300], // hp
    [100, 50, 25] // atk
  );

  await gameContract.deployed();
  console.log("Contract deployed to:" , gameContract.address);
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
