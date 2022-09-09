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
    [100, 50, 25], // atk
    // Boss
    "CROCODILE",
    "https://i.imgur.com/BehawOh.png",
    10000,
    50,
  );

  await gameContract.deployed();
  console.log("Contract deployed to:" , gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();
  
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);
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
