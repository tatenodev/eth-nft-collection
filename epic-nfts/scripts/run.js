const main = async () => {
  // コントラクトを扱うために必要なファイルが`artifacts`ディレクトリ直下に生成。
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  // hardhat がローカルの ethereum ネットワークを作成。
  const nftContract = await nftContractFactory.deploy();
  // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待つ。
  await nftContract.deployed();
  console.log("Contract deployed to: ", nftContract.address);

  // makeAnEpicNFT 関数を呼び出す。NFTがMintされる。
  let txn = await nftContract.makeAnEpicNFT();
  // Minting が仮想マイナーにより、承認されるのを待つ。
  await txn.wait();
  // makeAnEpicNFT関数をもう一度呼び出す。NFTがまたMintされる。
  txn = await nftContract.makeAnEpicNFT();
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
