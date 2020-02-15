import React, { Component } from "react";
// import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
// import { ApolloProvider, Query } from 'react-apollo'
import {
  // Grid,
  // LinearProgress,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,

  Button
} from "@material-ui/core";

import {
  getTokenReserves,
  getMarketDetails,
  getTradeDetails,
  TRADE_EXACT,
  tradeExactEthForTokensWithData,
  getExecutionDetails,
  FACTORY_ABI
} from "@uniswap/sdk";

import { BigNumber } from "bignumber.js";
import "./App.css";
// import Header from './components/Header'
// import Error from './components/Error'
// import Gravatars from './components/Gravatars'
// import Filter from './components/Filter'
import Fortmatic from "fortmatic";

import Web3 from "web3";
let fm = new Fortmatic("pk_test_001FD198F278ECC9", "ropsten");
window.web3 = new Web3(fm.getProvider());
// window.web3 = new Web3(window.web3.currentProvider);
const exchangeAddress = "0x242E084657F5cdcF745C03684aAeC6E9b0bB85C5"; //ROPSTEN TBTC EXCHANGE
const exchangeABI = require("./exchangeABI.json");

async function getMarkets() {
  const _purchaseAmount = new BigNumber("3");
  // const _purchaseAmount: BigNumber = new BigNumber('2.5')
  const _decimals = 18;
  const _tradeAmount = _purchaseAmount.multipliedBy(10 ** _decimals);

  let reserves = await getTokenReserves(
    "0x083f652051b9CdBf65735f98d83cc329725Aa957",
    3
  );

  let markets = await getMarketDetails(undefined, reserves);
  let trades = await getTradeDetails(
    TRADE_EXACT.input,
    _purchaseAmount,
    markets
  );
  let trade = await tradeExactEthForTokensWithData(reserves, _tradeAmount);
  let formattedTrade = await getExecutionDetails(trade);
  window.trade = formattedTrade;
  console.log("TRADE", formattedTrade);
  console.log(
    "Swap method arguments",
    formattedTrade.methodArguments[0],
    formattedTrade.methodArguments[1]
  );

  const exchangeContract = new window.web3.eth.Contract(
    exchangeABI,
    exchangeAddress
  );
  await exchangeContract.methods
    .ethToTokenSwapInput(
      formattedTrade.methodArguments[0],
      formattedTrade.methodArguments[1]
    )
    .send(
      { value: formattedTrade.value, from: window.ethereum.selectedAddress },
      function(receipt) {
        console.log(receipt);
      }
    );
}
// const tradeDetails: TradeDetails = getTradeDetails(TRADE_EXACT.OUTPUT, tradeAmount, marketDetails)

// getMarkets();

// if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
//   throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
// }

// const client = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
//   cache: new InMemoryCache(),
// })

// const GRAVATARS_QUERY = gql`
//   query gravatars($where: Gravatar_filter!, $orderBy: Gravatar_orderBy!) {
//     gravatars(first: 100, where: $where, orderBy: $orderBy, orderDirection: asc) {
//       id
//       owner
//       displayName
//       imageUrl
//     }
//   }
// `

const sendWeb3Transaction = () => {
  const { web3 } = window;
  const value = web3.utils.toWei("0.01", "ether");
  web3.eth.sendTransaction({
    // From address will automatically be replaced by the address of current user
    from: "0x0Cd462db67F44191Caf3756f033A564A0d37cf08",
    to: "0x178411f618bba04DFD715deffBdD9B6b13B958c4",
    value
  });
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withImage: false,
      withName: false,
      orderBy: "displayName",
      showHelpDialog: false
    };
  }

  // toggleHelpDialog = () => {
  //   this.setState(state => ({ ...state, showHelpDialog: !state.showHelpDialog }))
  // }

  // gotoQuickStartGuide = () => {
  //   window.location.href = 'https://thegraph.com/docs/quick-start'
  // }

  render() {
    // const { withImage, withName, orderBy, showHelpDialog } = this.state

    return (
      // <ApolloProvider client={client}>
      <div>
        <Button onClick={() => sendWeb3Transaction()}>Test</Button>
        <div className="App">
          BCTCBTtcTBTC
          {/* <Grid container direction="column">
            <Header onHelp={this.toggleHelpDialog} />
            <Filter
              orderBy={orderBy}
              withImage={withImage}
              withName={withName}
              onOrderBy={field => this.setState(state => ({ ...state, orderBy: field }))}
              onToggleWithImage={() =>
                this.setState(state => ({ ...state, withImage: !state.withImage }))
              }
              onToggleWithName={() =>
                this.setState(state => ({ ...state, withName: !state.withName }))
              }
            />
            <Grid item>
              <Grid container>
                <Query
                  query={GRAVATARS_QUERY}
                  variables={{
                    where: {
                      ...(withImage ? { imageUrl_starts_with: 'http' } : {}),
                      ...(withName ? { displayName_not: '' } : {}),
                    },
                    orderBy: orderBy,
                  }}
                >
                  {({ data, error, loading }) => {
                    return loading ? (
                      <LinearProgress variant="query" style={{ width: '100%' }} />
                    ) : error ? (
                      <Error error={error} />
                    ) : (
                      <Gravatars gravatars={data.gravatars} />
                    )
                  }}
                </Query>
              </Grid>
            </Grid>
          </Grid>
          <Dialog
            fullScreen={false}
            open={showHelpDialog}
            onClose={this.toggleHelpDialog}
            aria-labelledby="help-dialog"
          >
            <DialogTitle id="help-dialog">{'Show Quick Guide?'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                We have prepared a quick guide for you to get started with The Graph at
                this hackathon. Shall we take you there now?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleHelpDialog} color="primary">
                Nah, I'm good
              </Button>
              <Button onClick={this.gotoQuickStartGuide} color="primary" autoFocus>
                Yes, pease
              </Button>
            </DialogActions>
          </Dialog> */}
        </div>
      </div>
      // </ApolloProvider>
    );
  }
}

export default App;
