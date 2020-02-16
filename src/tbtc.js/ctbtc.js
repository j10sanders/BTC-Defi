// import Web3 from "web3";
// const tbtcTokenAddress = "0x083f652051b9CdBf65735f98d83cc329725Aa957";
// const cbtcTokenAddress = "0xb40d042a65dd413ae0fd85becf8d722e16bc46f1"; //ropsten

// function convertToCTBTC(ethWalletAddress, tbtcAmount) {
//   //grab ABI from ctbtc.json
//   var ctbtcABI = require("./ctbtcABI.json");
//   const compoundcTBTCContract = new Web3.eth.Contract(
//     ctbtcABI,
//     cbtcTokenAddress
//   );

//   const numCtbtcToMint = web3.utils.toWei(tbtcAmount, "ether");

//   compoundcTBTCContract.methods
//     .mint(ethWalletAddress, tbtcValue)
//     .send({
//       from: ethWalletAddress,
//       gasLimit: Web3.utils.toHex(150000), // posted at compound.finance/developers#gas-costs
//       gasPrice: Web3.utils.toHex(20000000000) // use ethgasstation.info (mainnet only)
//     })
//     .then(result => {
//       console.log('cTBTC "Mint" operation successful.');
//       return compoundcTBTCContract.methods
//         .balanceOfUnderlying(ethWalletAddress)
//         .call();
//     })
//     .then(balanceOfUnderlying => {
//       balanceOfUnderlying = Web3.utils.fromWei(balanceOfUnderlying).toString();
//       console.log(
//         "tBTC supplied to the Compound Protocol:",
//         balanceOfUnderlying
//       );
//       return compoundcTBTCContract.methods.balanceOf(ethWalletAddress).call();
//     })
//     .then(cTokenBalance => {
//       cTokenBalance = (cTokenBalance / 1e8).toString();
//       console.log("My wallet's cTBTC Token Balance:", cTokenBalance);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }

// export default convertToCTBTC;
