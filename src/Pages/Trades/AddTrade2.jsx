import React, { useState } from "react";

const AddTradeForm = ({ data }) => {
  console.log("data",data); // Log the data prop to check its value
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); // Track form errors
  const [dateError, setDateError] = useState(false); // Track date errors
  const [profitError, setProfitError] = useState(false);
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  console.log("accounts", accounts.accounts[0]);
   // Track profit/loss errors
  const [formData, setFormData] = useState({
    commodity: "",
    openDate: "",
    closeDate: "",
    profitLoss: "",
    equityBefore: "",
    equityAfter: "",
    comments: "",
    file: null,
    entryPrice: "",
    exitPrice: "",
    rrr: "",
    lotSize: "",
    account: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const openDate = new Date(formData.openDate);
    const closeDate = new Date(formData.closeDate);
    if (closeDate <= openDate) {
      setDateError(true);

      return;
    } else {
      setError(false);
      setIsSubmitting(true);
    }

    if (
      (formData.profitLoss && formData.profitLoss[0] !== "+") ||
      formData.profitLoss[0] !== "-"
    ) {
      setProfitError(true);
      setIsSubmitting(false);
      return;
    }

    if (
      !formData.account ||
      !formData.commodity ||
      !formData.openDate ||
      !formData.closeDate ||
      formData.tradeType === "" ||
      !formData.entryPrice ||
      !formData.exitPrice ||
      !formData.equityBefore ||
      !formData.equityAfter ||
      !formData.lotSize
    ) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Add your submit logic here (e.g., API call)
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-medium mb-4 text-gray-800 text-center">
        Add Trade
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Account
          </label>
          <select
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Account</option>
            {accounts.accounts && accounts.accounts.length > 0 ? (
              accounts.accounts.map((account, index) => (
                <option key={index} value={account.broker_name}>
                  {account["broker_name"]} ({account["account_number"]})
                </option>
              ))
            ) : (
              <option value="">No accounts available</option>
            )}
          </select>
        </div>
        {/* Commodity Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Commodity Name
          </label>
          <input
            type="text"
            name="commodity"
            value={formData.commodity}
            onChange={handleChange}
            placeholder="Enter commodity name"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Lot Size
          </label>
          <input
            type="number"
            step="0.01"
            name="lotSize"
            value={formData.lotSize}
            onChange={handleChange}
            placeholder="Enter lot size"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Trade Type
          </label>
          <select
            type="number"
            step="0.01"
            name="tradeType"
            value={formData.tradeType}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Trade Type</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        {/* Open Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Open Date
          </label>
          <input
            type="date"
            name="openDate"
            value={formData.openDate}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          {dateError && (
            <p className="text-red-500 text-sm">
              Close date must be after open date.
            </p>
          )}
        </div>

        {/* Close Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Close Date
          </label>
          <input
            type="date"
            name="closeDate"
            value={formData.closeDate}
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Profit/Loss Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Profit / Loss
          </label>
          <input
            type="number"
            step="0.01"
            name="profitLoss"
            value={formData.profitLoss}
            onChange={handleChange}
            placeholder="Enter + profit/ -loss"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          {profitError && (
            <p className="text-red-500 text-sm">
              Amount should include + for Profit or - for loss
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Entry Price
          </label>
          <input
            type="number"
            step="0.01"
            name="openPrice"
            value={formData.entryPrice}
            placeholder="Enter entry price"
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Exit Price
          </label>
          <input
            type="number"
            step="0.01"
            name="exitPrice"
            value={formData.exitPrice}
            onChange={handleChange}
            placeholder="Enter exit price"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Risk Reward Ratio
          </label>
          <input
            type="text"
            name="rrr"
            value={formData.rrr}
            onChange={handleChange}
            placeholder="Enter risk reward ratio"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Equity Before Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Equity Before
          </label>
          <input
            type="number"
            step="0.01"
            name="equityBefore"
            value={formData.equityBefore}
            onChange={handleChange}
            placeholder="Enter equity before"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Equity After Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Equity After
          </label>
          <input
            type="number"
            step="0.01"
            name="equityAfter"
            value={formData.equityAfter}
            placeholder="Enter equity after"
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Strategy
          </label>

          <input
            type="text"
            name="strategy"
            value={formData.strategy}
            onChange={handleChange}
            placeholder="Enter strategy name"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Comments
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Enter any comments or notes"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        {/* File Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Upload File
          </label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTradeForm;
