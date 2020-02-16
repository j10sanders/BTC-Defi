import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

export default ({ depositHandler }) => {
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  useEffect(() => {
    if (!bitcoinAddress && depositHandler) {
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
