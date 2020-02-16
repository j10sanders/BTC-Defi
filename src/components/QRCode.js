import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export default ({ depositHandler }) => {
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  console.log("Deposit handler", depositHandler)
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
  return <canvas id="canvas"></canvas>;
};
