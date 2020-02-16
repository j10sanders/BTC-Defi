import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export default ({ depositHandler, lot }) => {
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  console.log("Deposit handler", depositHandler);
  useEffect(() => {
    if (!bitcoinAddress && depositHandler && depositHandler.address) {
      depositHandler.bitcoinAddress.then(setBitcoinAddress);
    }
  }, [bitcoinAddress, depositHandler]);

  useEffect(() => {
    if (bitcoinAddress) {
      QRCode.toCanvas(document.getElementById("canvas"), bitcoinAddress);
    }
  }, [bitcoinAddress]);
  if (!bitcoinAddress) {
    return null;
  }
  return (
    <>
      <div
        style={{
          fontSize: "24px",
          marginBottom: "24px",
          color: "grey"
        }}
      >
        Scan this QR code with your TESTNET Bitcoin wallet
      </div>
      <canvas id="canvas"></canvas>
      <p>Or send your deposit amount to: {bitcoinAddress}</p>
      <div
        style={{
          fontSize: "24px",
          marginBottom: "24px",
          color: "#CC5252"
        }}
      >
        DO NOT ATTEMPT TO SEND ETHER TO THIS ADDRESS
      </div>
    </>
  );
};
