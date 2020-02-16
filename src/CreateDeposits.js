import { useEffect } from "react";
// import Fortmatic from "fortmatic";
import Web3 from "web3";
import TBTC from "./tbtc.js/TBTC.js";

// let fm = new Fortmatic("pk_test_001FD198F278ECC9", "ropsten");

export default () => {
  useEffect(() => {
    const doAsyncStuff = async () => {
      const web3 = new Web3(window.web3.currentProvider);
      const [defaultAccount] = await web3.eth.getAccounts();
      web3.eth.defaultAccount = defaultAccount;
      const tbtc = await TBTC.withConfig({
        web3,
        bitcoinNetwork: "testnet",
        electrum: {
          testnet: {
            server: "electrumx-server.test.tbtc.network",
            port: 50002,
            protocol: "ssl"
          },
          testnetPublic: {
            server: "testnet1.bauerj.eu",
            port: 50002,
            protocol: "ssl"
          },
          testnetWS: {
            server: "electrumx-server.test.tbtc.network",
            port: 50003,
            protocol: "ws"
          }
        }
      });
      const [smallestLot] = await tbtc.Deposit.availableSatoshiLotSizes();
      const arrayOfTen = new Array(10).fill(true);
      const tenDeposits = await Promise.all(
        arrayOfTen.map(async (_, i) => {
          return new Promise(async resolve => {
            try {
              const deposit = await tbtc.Deposit.withSatoshiLotSize(
                smallestLot
              );
              console.log("completed the deposit ", i);
              console.log("resolving address");
              deposit.bitcoinAddress
                .then(address => {
                  console.log("got address ", address);
                  return resolve(address);
                })
                .catch(() => resolve(null));
            } catch (err) {
              console.log("there was an error ", err);
              return null;
            }
          });
        })
      );

      console.log(tenDeposits);
    };

    doAsyncStuff();
  }, []);
  return null;
};
