import React, { Component, useState, useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { Container, Row, Col } from "react-bootstrap";
import {
  FormField,
  Grommet,
  Heading,
  Header,
  RadioButton,
  TextInput
} from "grommet";
// import { grommet } from "grommet/themes";
import QR from "./components/QRCode";
import { determineHelperText } from "./utils";

// import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
// import { ApolloProvider, Query } from 'react-apollo'

import {
  getTokenReserves,
  // getMarketDetails,
  // getTradeDetails,
  // TRADE_EXACT,
  // tradeExactEthForTokensWithData,
  tradeExactTokensForEthWithData,
  getExecutionDetails
  // FACTORY_ABI
} from "@uniswap/sdk";
import { BigNumber } from "bignumber.js";
// import {
//   // Grid,
//   // LinearProgress,
//   // Dialog,
//   // DialogActions,
//   // DialogContent,
//   // DialogContentText,
//   // DialogTitle,
//   Button
// } from "@material-ui/core";
import "./App.css";
// import Header from './components/Header'
// import Error from './components/Error'
// import Gravatars from './components/Gravatars'
// import Filter from './components/Filter'
import Fortmatic from "fortmatic";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { AwesomeButton as StyleButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

import {
  useLotsAndTbtcHandler,
  useBTCDepositListeners,
  usePendingDeposit,
  use3Box,
  getAddressAndBalances
} from "./hooks";

const AwesomeButton = styled(StyleButton)`
  --button-default-height: 48px;
  --button-default-font-size: 14px;
  --button-default-border-radius: 6px;
  --button-horizontal-padding: 20px;
  /* --button-raise-level: 5px; */
  --button-hover-pressure: 2;
  --transform-speed: 0.185s;
  --button-primary-color: #3d66ff;
  --button-primary-color-dark: #2a3143;
  --button-primary-color-light: #d4d9e4;
  --button-primary-color-hover: #213fad;
  --button-primary-border: none;
  --button-secondary-color: #fffc6c;
  --button-secondary-color-dark: #b9b500;
  --button-secondary-color-light: #6c6a00;
  --button-secondary-color-hover: #fffb3e;
  --button-secondary-border: none;
  --button-anchor-color: #f3c8ad;
  --button-anchor-color-dark: #734922;
  --button-anchor-color-light: #4c3016;
  --button-anchor-color-hover: #f1bfa0;
  --button-anchor-border: 1px solid #8c633c;
`;

let fm = new Fortmatic("pk_test_001FD198F278ECC9", "ropsten");
const provider = fm.getProvider();
const web3 = new Web3(provider);
const myTheme = {
  radioButton: {
    check: {
      color: "#1A5AFE"
    }
  },
  global: {
    font: {
      family: "Rubik, sans-serif !important"
    }
  }
};

const StyledDots = styled.img`
  left: 0;
  position: fixed;
  top: 104px;
`;

const StyledNumber = styled.img`
  /* margin-top: -11px; */
  padding-right: 20px;
`;

const HeaderText = styled.div`
  font-size: 32px;
  font-weight: 500;
  display: inline;
`;

const StyledHeading = styled(Heading)`
  /* padding-top: 7px;
  padding-bottom: 5px; */
  /* padding-top: 20px; */
  background-color: white;
  margin: 0 auto;
`;

const UnderHeader = styled.div`
  margin-top: 10px;
  padding-left: 68px;
`;
// const mnemonic =
//   "egg dune news grocery detail frog kiwi hidden tuna noble speak over";

// const provider = new HDWalletProvider(
//   mnemonic,
//   "https://ropsten.infura.io/v3/bf239bcb4eb2441db2ebaff8f9d80363"
// );

// let fm = new Fortmatic("pk_test_001FD198F278ECC9", "ropsten");

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
const exchangeAddress = "0x242E084657F5cdcF745C03684aAeC6E9b0bB85C5"; //ROPSTEN TBTC EXCHANGE
const exchangeABI = require("./exchangeABI.json");
const tbtcTokenAddress = "0x083f652051b9CdBf65735f98d83cc329725Aa957";
const cbtcTokenAddress = "0xb40d042a65dd413ae0fd85becf8d722e16bc46f1"; //ropsten
var ctbtcABI = require("./ctbtcABI.json");

const approveCtbcContract = async currentAddress => {
  const tbtcTokenContract = new web3.eth.Contract(ctbtcABI, tbtcTokenAddress);
  let receipt;
  try {
    console.log("Current Address", currentAddress);
    receipt = await tbtcTokenContract.methods
      .approve(cbtcTokenAddress, web3.utils.toBN(10e18))
      .send({ from: currentAddress });
  } catch (err) {
    console.error("Error approving Compound Contract", err);
  }
};
const useTbtcToMintCtbtc = async (currentAddress, inputAmount) => {
  console.log("MINT CALLED", currentAddress, inputAmount);
  inputAmount = ".01";
  //grab ABI from ctbtc.json
  console.log("MINT CALLED", currentAddress, inputAmount);
  const cTBTCContract = new web3.eth.Contract(ctbtcABI, cbtcTokenAddress);
  const numCtbtcToMint = web3.utils.toWei(inputAmount.toString(), "ether"); //mint amount should be first arg
  let receipt;
  try {
    receipt = await cTBTCContract.methods.mint(numCtbtcToMint).send({
      from: currentAddress
    });
    console.log("Minted receipt", receipt);
  } catch (err) {
    console.error("Err minting", err);
  }
};

const approveUniswapContract = async currentAddress => {
  console.log("Approving uniswap");
  const tbtcTokenContract = new web3.eth.Contract(ctbtcABI, tbtcTokenAddress);
  let receipt;
  try {
    receipt = await tbtcTokenContract.methods
      .approve(exchangeAddress, web3.utils.toBN(10e18))
      .send({ from: currentAddress });
  } catch (err) {
    console.error("Error approving Uniswap", err);
  }
  console.log(receipt);
};

const convertTBTCtoETH = async (currentAddress, purchaseAmountString) => {
  console.log("HIT!", purchaseAmountString);
  const purchaseAmount = new BigNumber(purchaseAmountString.toString());
  console.log(purchaseAmount);
  const _decimals = 18;
  const _tradeAmount = purchaseAmount.shiftedBy(_decimals);
  console.log("TradeAmount" + _tradeAmount);

  let reserves = await getTokenReserves(
    "0x083f652051b9CdBf65735f98d83cc329725Aa957",
    3
  );
  let trade = await tradeExactTokensForEthWithData(reserves, _tradeAmount);
  let formattedTrade = await getExecutionDetails(trade);

  console.log("formattedTrade", formattedTrade);
  window.trade = formattedTrade;
  console.log(
    "Swap method arguments",
    formattedTrade.methodArguments[0],
    formattedTrade.methodArguments[1],
    formattedTrade.methodArguments[2]
  );

  const exchangeContractInstance = new web3.eth.Contract(
    exchangeABI,
    exchangeAddress
  );
  let receipt = await exchangeContractInstance.methods
    .tokenToEthSwapInput(
      formattedTrade.methodArguments[0],
      formattedTrade.methodArguments[1],
      formattedTrade.methodArguments[2]
    )
    .send({ from: currentAddress });
  console.log("Converrted TBTC to ETH on uniswap " + receipt.toString());
};

// async function getMarkets() {
//   const _purchaseAmount = new BigNumber("3");
//   // const _purchaseAmount: BigNumber = new BigNumber('2.5')
//   const _decimals = 18;
//   const _tradeAmount = _purchaseAmount.multipliedBy(10 ** _decimals);

//   let reserves = await getTokenReserves(
//     "0x083f652051b9CdBf65735f98d83cc329725Aa957",
//     3
//   );

//   let markets = await getMarketDetails(undefined, reserves);
//   let trades = await getTradeDetails(
//     TRADE_EXACT.input,
//     _purchaseAmount,
//     markets
//   );
//   let trade = await tradeExactEthForTokensWithData(reserves, _tradeAmount);
//   let formattedTrade = await getExecutionDetails(trade);
//   window.trade = formattedTrade;
//   console.log("TRADE", formattedTrade);
//   console.log(
//     "Swap method arguments",
//     formattedTrade.methodArguments[0],
//     formattedTrade.methodArguments[1]
//   );
//   const [currentAccount] = await web3.eth.getAccounts();

const MobileCol = styled(Col)`
  @media screen and (max-width: 992px) {
    display: none;
  }
}
`;

const toBtcSize = largeNum => new BigNumber(largeNum).shiftedBy(-8).toString();

const StepComponent = ({ image, loading, headerText, stepDone, style }) => {
  console.log(image, "image");
  return (
    <div style={{ display: "flex", marginRight: "10px", ...style }}>
      <div style={{ display: "inline" }}>
        <StyledNumber src={!stepDone ? image : "/done.svg"} alt="first step" />
        {loading && (
          <CircularProgress
            size="48px"
            style={{
              marginLeft: "-68px",
              marginTop: "-11px",
              marginRight: "10px"
            }}
          />
        )}
      </div>
      <div style={{ marginTop: "11px", display: "inline" }}>
        <HeaderText>{headerText}</HeaderText>
      </div>
    </div>
  );
};

const App = () => {
  const [step, setStep] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [step1SigsRequired, setStep1SigsRequired] = useState(2);
  const [
    submittedInitialDepositAmount,
    setSubmittedInitialDepositAmount
  ] = useState(false);
  const [txInFlight, setTxInFlight] = useState(false);
  const [error, setError] = useState("");
  const [lots, setLots] = useState([]);
  const [tbtcHandler, setTbtcHandler] = useState(null);
  const [depositHandler, setDepositHandler] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [depositSatoshiAmount, setDepositSatoshiAmount] = useState(null);
  const [inputAmount, setInputAmount] = useState("0");
  const { currentAddress, balances } = getAddressAndBalances();
  const { pendingDepositAddress, tbtcDepositSpace } = use3Box(setStep);
  const [bitcoinDepositComplete, setBitcoinDepositComplete] = useState(false);
  useLotsAndTbtcHandler(setError, setLots, setTbtcHandler);
  useBTCDepositListeners(
    depositHandler,
    setSubmitting,
    submitting,
    setStep,
    setLoading,
    setTxInFlight,
    setBitcoinDepositComplete
  );
  usePendingDeposit(
    tbtcHandler,
    pendingDepositAddress,
    submitting,
    setSubmitting,
    setDepositHandler,
    setStep,
    setLoading,
    setStep1SigsRequired,
    setTxInFlight,
    setBitcoinDepositComplete
  );

  return (
    <Grommet theme={myTheme}>
      <Header
        pad="small"
        style={{ textAlign: "center", borderBottom: "1px solid #DFE0E5" }}
      >
        <StyledHeading size="small" color="#1A5AFE">
          Bitcoin Earn
        </StyledHeading>
      </Header>
      {/* <button
        onClick={async () => {
          await tbtcDepositSpace.public.remove("tbtc-deposit");
        }}
      >
        Erase 3Box
      </button> */}
      <Container style={{ paddingTop: "40px" }}>
        <Row>
          <MobileCol md={2} sm={0}>
            <StyledDots src="/dot-grid-triangle.svg" alt="dots for fun" />
          </MobileCol>
          <Col md={10} sm={12}>
            <StepComponent
              image="/one.svg"
              stepDone={step > 0}
              headerText={determineHelperText(
                step1SigsRequired,
                submittedInitialDepositAmount,
                pendingDepositAddress
              )}
              loading={step === 0 && loading}
            />
            {step1SigsRequired > 1 && (
              <UnderHeader>
                <div
                  style={{
                    fontSize: "24px",
                    marginBottom: "24px",
                    color: "grey"
                  }}
                >
                  Once your deposit is received, you will be sent{" "}
                  <a href="https://tbtc.network/">TBTC</a>
                </div>
                {lots && lots.length > 0 ? (
                  <>
                    {lots
                      .sort((a, b) => a - b)
                      .map((lot, i) => {
                        return (
                          <RadioButton
                            key={i}
                            checked={depositSatoshiAmount === lot}
                            onChange={() => {
                              setDepositSatoshiAmount(lot);
                            }}
                            label={`${toBtcSize(lot)} BTC`}
                            name={`${toBtcSize(lot)} BTC`}
                          />
                        );
                      })}
                  </>
                ) : (
                  <div>
                    <CircularProgress />
                  </div>
                )}
                {depositSatoshiAmount && (
                  <>
                    <div style={{ paddingTop: "20px" }}>
                      Once you click “create deposit”, you’ll be prompted twice
                      to sign messages.
                    </div>
                  </>
                )}
                <AwesomeButton
                  button-default-border-radius="6px"
                  style={{
                    marginTop: "14px"
                    // padding: "20px"
                  }}
                  disabled={
                    !depositSatoshiAmount ||
                    depositSatoshiAmount.lte(0) ||
                    step !== 0
                  }
                  onPress={async () => {
                    setLoading(true);
                    setSubmittedInitialDepositAmount(true);
                    const deposit = await tbtcHandler.Deposit.withSatoshiLotSize(
                      depositSatoshiAmount,
                      setStep1SigsRequired
                    );
                    console.log("got deposit");
                    tbtcDepositSpace.public.set(
                      "tbtc-deposit",
                      deposit.address
                    );
                    console.log("set in 3box space");
                    setDepositHandler(deposit);
                  }}
                >
                  {`Create ${
                    depositSatoshiAmount ? toBtcSize(depositSatoshiAmount) : ""
                  } BTC Deposit`}
                </AwesomeButton>
              </UnderHeader>
            )}
            <StepComponent
              style={{ marginTop: "55px " }}
              image="/two.svg"
              stepDone={step > 1}
              headerText="Send BTC"
              loading={txInFlight && !bitcoinDepositComplete}
            />
            {!txInFlight && (
              <UnderHeader>
                <QR
                  shouldDisplay={depositHandler && depositHandler.address}
                  depositHandler={depositHandler}
                />
              </UnderHeader>
            )}
            <StepComponent
              style={{ marginTop: "55px" }}
              image="/three.svg"
              stepDone={false}
              headerText="Earn interest with your TBTC"
              loading={false}
            />
            {step === 2 && (
              <UnderHeader>
                <div style={{ marginBottom: "20px" }}>
                  <div>{`Your TBTC Balance: ${balances.TBTC}`}</div>
                  <br />
                  <div>{`Your CTBTC Balance: ${balances.CTBTC}`}</div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <AwesomeButton
                    onPress={() => {
                      approveCtbcContract(currentAddress);
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Enable Compound Bitcoin
                  </AwesomeButton>
                  <AwesomeButton
                    onPress={() => {
                      approveUniswapContract(currentAddress);
                    }}
                  >
                    Enable Uniswap trading
                  </AwesomeButton>
                </div>
                <div
                  style={{
                    width: "200px",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <p style={{ marginBottom: "5px" }}>Amount in TBTC</p>
                  <TextInput
                    style={{ marginRight: "5px" }}
                    size="small"
                    value={inputAmount}
                    onChange={event => setInputAmount(event.target.value)}
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <AwesomeButton
                    onPress={() => {
                      useTbtcToMintCtbtc(currentAddress, inputAmount);
                    }}
                    disabled={
                      !balances.result ||
                      balances.result === "0" ||
                      !currentAddress
                    }
                    style={{ marginRight: "10px" }}
                  >
                    Convert to Compound Bitcoin (CTBTC)
                  </AwesomeButton>
                  <AwesomeButton
                    onPress={() => {
                      convertTBTCtoETH(currentAddress, inputAmount);
                    }}
                    disabled={
                      !balances.result1 ||
                      balances.result1 === "0" ||
                      !currentAddress
                    }
                    style={{ marginRight: "10px" }}
                  >
                    Swap for ETHER
                  </AwesomeButton>
                </div>
              </UnderHeader>
            )}
          </Col>
        </Row>
      </Container>
    </Grommet>
  );
};

// class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       lots: []
//     }
//   }

//   // toggleHelpDialog = () => {
//   //   this.setState(state => ({ ...state, showHelpDialog: !state.showHelpDialog }))
//   // }

//   // gotoQuickStartGuide = () => {
//   //   window.location.href = 'https://thegraph.com/docs/quick-start'
//   // }

//   render() {
//     // const { withImage, withName, orderBy, showHelpDialog } = this.state

//     return (
//       // <ApolloProvider client={client}>
//       <div>
//         <Button onClick={() => sendWeb3Transaction()}>Test</Button>
//         <div className="App">
//           BCTCBTtcTBTC
//           {/* <Grid container direction="column">
//             <Header onHelp={this.toggleHelpDialog} />
//             <Filter
//               orderBy={orderBy}
//               withImage={withImage}
//               withName={withName}
//               onOrderBy={field => this.setState(state => ({ ...state, orderBy: field }))}
//               onToggleWithImage={() =>
//                 this.setState(state => ({ ...state, withImage: !state.withImage }))
//               }
//               onToggleWithName={() =>
//                 this.setState(state => ({ ...state, withName: !state.withName }))
//               }
//             />
//             <Grid item>
//               <Grid container>
//                 <Query
//                   query={GRAVATARS_QUERY}
//                   variables={{
//                     where: {
//                       ...(withImage ? { imageUrl_starts_with: 'http' } : {}),
//                       ...(withName ? { displayName_not: '' } : {}),
//                     },
//                     orderBy: orderBy,
//                   }}
//                 >
//                   {({ data, error, loading }) => {
//                     return loading ? (
//                       <LinearProgress variant="query" style={{ width: '100%' }} />
//                     ) : error ? (
//                       <Error error={error} />
//                     ) : (
//                       <Gravatars gravatars={data.gravatars} />
//                     )
//                   }}
//                 </Query>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Dialog
//             fullScreen={false}
//             open={showHelpDialog}
//             onClose={this.toggleHelpDialog}
//             aria-labelledby="help-dialog"
//           >
//             <DialogTitle id="help-dialog">{'Show Quick Guide?'}</DialogTitle>
//             <DialogContent>
//               <DialogContentText>
//                 We have prepared a quick guide for you to get started with The Graph at
//                 this hackathon. Shall we take you there now?
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={this.toggleHelpDialog} color="primary">
//                 Nah, I'm good
//               </Button>
//               <Button onClick={this.gotoQuickStartGuide} color="primary" autoFocus>
//                 Yes, pease
//               </Button>
//             </DialogActions>
//           </Dialog> */}
//         </div>
//         </div>
//       // </ApolloProvider>
//     )
//   }
// }

export default App;
