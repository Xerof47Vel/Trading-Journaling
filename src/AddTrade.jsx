import React from "react";
import { useState } from "react";
const TradeInputForm = () => {
  const [trade, setTrade] = useState({
    commodity: "",
    tradeType: "BUY",
    lotSize: "",
    entryPrice: "",
    exitPrice: "",
    openDate: "",
    closeDate: "",
    profitLoss: "",
    equityBefore: "",
    equityAfter: "",
    stopLoss: "",
    takeProfit: "",
    broker: "",
    strategy: "",
    comments: "",
  });

  const [customLotSize, setCustomLotSize] = useState("custom");

  const handleLotSizeChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      // Keep trade.lotSize empty and show the input field for custom size
      setTrade({ ...trade, lotSize: "custom" });
    } else {
      // Set predefined lot size
      setTrade({ ...trade, lotSize: value });
    }
  };
  //   const handleCustomLotSizeChange = (e) => {
  //     const value = e.target.value;
  //     setCustomLotSize(value); // Update customLotSize separately
  //     setTrade({ ...trade, lotSize: value }); // Update trade.lotSize with the custom value
  //   };
  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
  };
  return (
    <div className="bodyContainer">
      <div className="inputFormContainer">
        <form className="inputForm">
          <label className="inputFormLabels" htmlFor="commodityName">
            Commodity Name
          </label>
          <input
            type="text"
            id="commodityName"
            className="inputFormInputBox"
            required
            placeholder="Enter Commodity Name"
            name="commodity"
          />
          <br />
          <label htmlFor="account-number">Account Number</label>
          <input
            type="text"
            id="account-number"
            name="account-number"
            placeholder="Enter Account Number"
            className="inputFormInputBox"
          />
          <br />
          <label htmlFor="tradeType">Buy Or Sell</label>
          <select name="tradeType" id="tradeType" required>
            <option value="">SelectOption</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
          <br />
          <label htmlFor="lotSize">Lot Size</label>
          <select name="lotSize" id="lotSize" onChange={handleLotSizeChange}>
            <option value="0.01">0.01</option>
            <option value="0.1">0.1</option>
            <option value="1">1</option>
            <option value="custom">Custom</option>
          </select>
          {trade.lotSize === "custom" && (
            <>
              <input
                type="number"
                step="0.01"
                name="customLotSize"
                placeholder="Custom Lot Size"
                min="0"
                className="inputFormInputBox"
              />
            </>
          )}
          <br />
          <label htmlFor="entryPrice">Entry Price</label>
          <input
            type="number"
            name="entryPrice"
            placeholder="Entry Price"
            onChange={handleChange}
            required
            min="0"
            id="entryPrice"
            className="inputFormInputBox"
          />
          <br />
          <label htmlFor="exitPrice">Exit Price</label>
          <input
            type="number"
            name="exitPrice"
            placeholder="Exit Price"
            onChange={handleChange}
            className="inputFormInputBox"
            id="exitPrice"
          />
          <br />
          <label htmlFor="openDate">Open Time</label>
          <input
            type="datetime-local"
            name="openDate"
            id="openDate"
            onChange={handleChange}
            required
          />{" "}
          <br />
          <label htmlFor="closeDate">Closing Time</label>
          <input
            type="datetime-local"
            name="closeDate"
            id="closeDate"
            onChange={handleChange}
          />
          <br />
          <br />
          <label htmlFor="equityBefore">Equity Before</label>
          <input
            type="number"
            name="equityBefore"
            id="equityBefore"
            placeholder="Equity Before"
            onChange={handleChange}
            className="inputFormInputBox"
            required
            min="0"
          />{" "}
          <br />
          <label htmlFor="equityAfter">Equity After</label>
          <input
            type="number"
            name="equityAfter"
            id="equityAfter"
            placeholder="Equity After"
            onChange={handleChange}
            className="inputFormInputBox"
            required
            min="0"
          />
          <br />
          <label htmlFor="sl">Stop Loss Price</label>
          <input
            type="number"
            name="stopLoss"
            id="sl"
            placeholder="Stop Loss"
            onChange={handleChange}
            className="inputFormInputBox"
            min="0"
          />{" "}
          <br />
          <label htmlFor="tp">Take Profit Price</label>
          <input
            type="number"
            name="takeProfit"
            id="tp"
            placeholder="Take Profit"
            onChange={handleChange}
            className="inputFormInputBox"
            min="0"
          />
          <br />
          <label htmlFor="pL">Profit or Loss</label>
          <input
            type="number"
            name="profitLoss"
            id="pL"
            placeholder="+Profit / -Loss"
            onChange={handleChange}
            className="inputFormInputBox"
          />
          <br />
          <label htmlFor="riskReward">Risk/Reward Ratio</label>
          <input
            type="text"
            id="riskReward"
            name="riskReward"
            placeholder="Risk/Reward Ratio"
            onChange={handleChange}
            className="inputFormInputBox"
          />
          <br />
          <label htmlFor="strategyUsed">Strategy Used</label>
          <select
            name="strategy"
            onChange={handleChange}
            id="strategyUsed"
            required
          >
            <option value="">Select Strategy</option>
            <option value="Scalping">Scalping</option>
            <option value="Swing Trading">Swing Trading</option>
            <option value="Day Trading">Day Trading</option>
            <option value="Position Trading">Position Trading</option>
          </select>
          <br />
          {/* Tags/Labels */}
          <label htmlFor="tags">Tags/Labels</label>
          <select id="tags" name="tags" onChange={handleChange}>
            <option value="">Select Tag</option>
            <option value="High Risk">High Risk</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Volatile">Volatile</option>
            <option value="Stable">Stable</option>
          </select>
          <br />
          <label
            htmlFor="comments"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            placeholder="Any additional details"
            onChange={handleChange}
          />
          <br />
          <button
            type="submit"
            style={{
              width: "100%",
              background: "#007bff",
              color: "#fff",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Submit Trade
          </button>
        </form>
      </div>
    </div>
  );
};

export default TradeInputForm;
