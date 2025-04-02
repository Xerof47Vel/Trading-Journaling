import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
function TradingAccountForm(props) {
  const [brokerName, setBrokerName] = useState(""); // Broker Name
  const [accountType, setAccountType] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");
  const [accountNumber, setAccountNumber] = useState(""); // Account Number




  const [isPending, setIsPending] = useState(false);

  const resetForm = () => {
    setBrokerName(""); // Reset brokerName state
    setAccountType(""); // Reset accountType state
    setCurrency("USD"); // Reset currency to default USD
    setBalance(""); // Reset balance state
    setAccountNumber(""); // Reset accountNumber state

  }
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add a new trading account by passing the details to the parent
    const newAccount = {
      type:"add_trading_account",
      body:{
      userId: 1,
      brokerName: brokerName,
      accountType: accountType,
      currency: currency,
      balance: balance,
      accountNumber: accountNumber,
    }};
    setIsPending(true); // Set loading state to true before submission
    console.log("New Account:", newAccount);
    axios
      .post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/addtrade",
        JSON.stringify(newAccount)).then((response) => {
        console.log("Account added successfully:", response.data);
        setIsPending(false); // Set loading state to false after submission
        resetForm(); // Reset the form after successful submission
        }).catch((error) => {
        console.error("Error adding account:", error);
        setIsPending(false); // Set loading state to false after submission
        });

  };

  return (
    <div className="bodyContainer">
      <div className="inputFormContainer">
        {
          isPending && (<Loader/>)

        }
        <div className="inputForm">
          <h2>Add New Trading Account</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="broker-name">Broker Name:</label>
              <input
                type="text"
                id="broker-name"
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
                placeholder="Enter account name"
                className="inputFormInputBox"
                required
              />
            </div>

            <div>
              <label>Account Type:</label>
              <select
                name="account-type"
                id="account-type"
                required
                className="inputFormInputBox"
                onChange={(e) => setAccountType(e.target.value)} // Handling change for `accountType`
                value={accountType} // Changed to `accountType`
              >
                <option value="Select Account Type" disabled>
                  Select Account Type
                </option>
                <option value="Prop-Firm">Prop-Firm</option>
                <option value="Personal">Personal- Demo</option>
                <option value="Personal-Real">Personal-Real</option>
              </select>
            </div>

            <div>
              <label htmlFor="account-number">Account Number *:</label>
              <input
                id="account-number"
                type="text"
                value={accountNumber} // Changed to `accountNumber`
                onChange={(e) => setAccountNumber(e.target.value)} // Handling change for `accountNumber`
                placeholder="Enter account number"
                required
                className="inputFormInputBox"
              />
            </div>

            <div>
              <label>Currency:</label>
              
                <select
                  name="currency"
                  id="currency"
                  required
                  className="inputFormInputBox"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  
                  <option value="USD">USD - United States Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="HKD">HKD - Hong Kong Dollar</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="NZD">NZD - New Zealand Dollar</option>
                  <option value="SEK">SEK - Swedish Krona</option>
                  <option value="NOK">NOK - Norwegian Krone</option>
                  <option value="DKK">DKK - Danish Krone</option>
                  <option value="KRW">KRW - South Korean Won</option>
                  <option value="TRY">TRY - Turkish Lira</option>
                  <option value="RUB">RUB - Russian Ruble</option>
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="MYR">MYR - Malaysian Ringgit</option>
                  <option value="THB">THB - Thai Baht</option>
                  <option value="PHP">PHP - Philippine Peso</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="AED">AED - United Arab Emirates Dirham</option>
                </select>
              </div>
     

            <div>
              <label>Balance:</label>
              <input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="inputFormInputBox"
                required
              />
            </div>

            <button type="submit">Add Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TradingAccountForm;
