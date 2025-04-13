import React from "react";
import { useState } from "react";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const TradeInputForm = (props) => {
  const S3_BUCKET = "tradingpictures";

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
    tags: "",
    tradeLink: "",
    tradeImages: [],
    riskReward: "",
    accountNumber: "",
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [customLotSize, setCustomLotSize] = useState("custom");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    // Reset form to initial state
    document.getElementById("commodityName").value = "";
    document.getElementById("account-number").value = " ";
    document.getElementById("tradeType").value = "";
    document.getElementById("lotSize").value = "0.01";
    document.getElementById("entryPrice").value = "";
    document.getElementById("exitPrice").value = "";
    document.getElementById("openDate").value = "";
    document.getElementById("closeDate").value = "";
    document.getElementById("equityBefore").value = "";
    document.getElementById("equityAfter").value = "";
    document.getElementById("sl").value = "";
    document.getElementById("tp").value = "";
    document.getElementById("pL").value = "";
    document.getElementById("riskReward").value = "";
    document.getElementById("strategyUsed").value = "";
    document.getElementById("tags").value = "";
    document.getElementById("comments").value = "";
    document.getElementById("tradeLinks").value = "";
    document.getElementById("tradeImages").value = "";

    // Reset trade state
    setTrade({
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
      tags: "",
      tradeLink: "",
      tradeImages: [],
      riskReward: "",
      accountNumber: "",
    });
  };
  const getSignedUrl = async (file) => {
    try {
      const body= {
        
          body: {
            file_name: file.name,
            file_type: file.type,
          }
      }
      console.log("Request body for signed URL:", body);
      const response = await axios.post("https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/createImageLink",body
        
      );
      
      // Correctly parse the response based on its structure
      let responseBody;
      if (typeof response.data === 'string') {
        responseBody = JSON.parse(response.data);
      } else {
        responseBody = response.data;
      }
      
      if (typeof responseBody.body === 'string') {
        responseBody = JSON.parse(responseBody.body);
      }
      
      console.log("Response with signed URL:", responseBody);
      
      if (!responseBody.url) {
        console.error("No URL in response:", responseBody);
        return null;
      }
      
      return responseBody;
    } catch (error) {
      console.error("Error getting signed URL", error);
      return null;
    }
  };
  const getUrls = async () => {
    const images = document.getElementById("tradeImages").files;
    const signedUrls = [];
  
    if (images.length === 0) {
      return []; // Return empty array if no images selected
    }
  
    for (const image of images) {
      try {
        const signedUrlData = await getSignedUrl(image);
        
        if (!signedUrlData || !signedUrlData.url) {
          console.error("Failed to get signed URL for image:", image.name);
          continue;
        }
        
        console.log(`Got signed URL for ${image.name}:`, signedUrlData.url);
        
        // Upload the image using the signed URL
        await axios.put(signedUrlData.url, image, {
          headers: {
            "Content-Type": image.type
          }
        });
        
        console.log(`Image ${image.name} uploaded successfully`);
        
        // Extract the base URL without query parameters
        const baseUrl = signedUrlData.url.split('?')[0];
        signedUrls.push(baseUrl);
        console.log(signedUrls);
      } catch (error) {
        console.error(`Error processing image ${image.name}:`, error);
      }
    }
    
    return signedUrls;
  };

  const validateInfo = async (e) => {
    e.preventDefault();

    const openDate = new Date(document.getElementById("openDate").value);
    const closeDate = new Date(document.getElementById("closeDate").value);
    if (closeDate <= openDate) {
      setErrorMessage("Closing date must be after opening date.");
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);

      const tradeData =  await structureData();
      console.log("Trade Submitted", tradeData); //
      setIsPending(true);
      axios
        .post(
          "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/addtrade",
          JSON.stringify(tradeData)
        )
        .then((res) => {
          console.log("Trade submitted successfully", res.data);
          setIsPending(false);
          setErrorMessage("Trade submitted successfully!");
          setShowErrorModal(true);
          resetForm(); // Reset the form after successful submission
          // Handle success response here
        })
        .catch((error) => {
          console.error("Error submitting trade", error);
          setIsPending(false);
          setErrorMessage("Error submitting trade. Please try again.");
          setShowErrorModal(true);
          // Handle error response here
        });
    }
  };
  const structureData = async() => {
    let lotS = "";
    if (trade.lotSize === "custom") {
      lotS = document.getElementById("customLotSize").value;
    } else lotS = trade.lotSize;

    let images =await getUrls();
    console.log(images);
    const tradeData = {

      type: "add_trade",
      body: {
        userId: 1,
        accountNumber: document.getElementById("account-number").value,
        tradeImages: " ",
        commodity: document.getElementById("commodityName").value,
        tradeType: document.getElementById("tradeType").value,
        lotSize: parseFloat(lotS),
        entryPrice: parseFloat(document.getElementById("entryPrice").value),
        exitPrice: parseFloat(document.getElementById("exitPrice").value),
        openDate: new Date(
          document.getElementById("openDate").value
        ).toISOString(),
        closeDate: new Date(
          document.getElementById("closeDate").value
        ).toISOString(),
        profitLoss: parseFloat(document.getElementById("pL").value),
        equityBefore: parseFloat(document.getElementById("equityBefore").value),
        equityAfter: parseFloat(document.getElementById("equityAfter").value),
        stopLoss: parseFloat(document.getElementById("sl").value),
        takeProfit: parseFloat(document.getElementById("tp").value),
        strategy: document.getElementById("strategyUsed").value,
        comments: document.getElementById("comments").value,
        tags: document.getElementById("tags").value,
        tradeLink: images.toString().concat(document.getElementById("tradeLinks").value),
      },
    };

    return tradeData;
  };

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
  const handleChange = (e) => {};
  return (
    <div className="bodyContainer">
      {isPending && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h3>Submitting Trade...</h3>
            <p>Please wait while your trade is being processed.</p>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
          </div>
        </div>
      )}
      <div className="inputFormContainer">
        {showErrorModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(0,0,0,0.5)",
              padding: "20px",
              borderRadius: "8px",
              color: "white",
            }}
          >
            <h2>
              {errorMessage.includes("successfully") ? "Success" : "Error"}
            </h2>
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorModal(false)}>Close</button>
          </div>
        )}
        <form className="inputForm" onSubmit={validateInfo}>
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
          <select
            id="account-number"
            name="account-number"
            placeholder="Enter Account Number (optional)"
          >
            <option value=" ">Select Account</option>
          </select>
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
                id="customLotSize"
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
            step="0.0001"
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
            min="0"
            step="0.01"
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
          <label
            htmlFor="tradeLinks"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Trade Links
          </label>
          <textarea
            name="tradeLinks"
            placeholder="Trade Links (Separate multiple links with spaces)"
            onChange={handleChange}
            className="tradeLink"
            id="tradeLinks"
          />
          <br />
          <label htmlFor="tradeImages">Trade Images</label>
          <input
            type="file"
            name="tradeImages"
            accept="image/*"
            id="tradeImages"
            multiple
            onChange={handleChange}
          />
          {!isPending && (
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
          )}
          {isPending && (
            <button
              type="submit"
              disabled
              style={{
                width: "100%",
                background: "#e63946",
                color: "#fff",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Submitting Trade...
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default TradeInputForm;
