import Web3 from "web3";

function convertToCTBTC (ethWalletAddress, tbtcValue) {
    const contractAddress = "0xb40d042a65dd413ae0fd85becf8d722e16bc46f1"; //ropsten
    //grab ABI from ctbtc.json
    var fs = require("fs");
    var jsonFile = "./ctbtc.json";
    var parsed = JSON.parse(fs.readFileSync(jsonFile));
    var abi = parsed.abi;
  
    const compoundcTBTCContract = new Web3.eth.Contract(abi, contractAddress);
  
    console.log("Sending ETH to the Compound Protocol...");
    compoundcTBTCContract.methods
      .mint()
      .send({
        from: ethWalletAddress,
        gasLimit: Web3.utils.toHex(150000), // posted at compound.finance/developers#gas-costs
        gasPrice: Web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
        value: Web3.utils.toHex(Web3.utils.toWei(tbtcValue, "ether"))
      })
      .then(result => {
        console.log('cTBTC "Mint" operation successful.');
        return compoundcTBTCContract.methods
          .balanceOfUnderlying(ethWalletAddress)
          .call();
      })
      .then(balanceOfUnderlying => {
        balanceOfUnderlying = Web3.utils.fromWei(balanceOfUnderlying).toString();
        console.log(
          "tBTC supplied to the Compound Protocol:",
          balanceOfUnderlying
        );
        return compoundcTBTCContract.methods.balanceOf(ethWalletAddress).call();
      })
      .then(cTokenBalance => {
        cTokenBalance = (cTokenBalance / 1e8).toString();
        console.log("My wallet's cTBTC Token Balance:", cTokenBalance);
      })
      .catch(error => {
        console.error(error);
      });
  };

  export default convertToCTBTC;