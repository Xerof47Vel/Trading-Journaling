import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  X,
  Activity,
} from "lucide-react";
import axios from "axios";
const AddTradeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    date: false,
    profit: false,
    requiredFields: false,
  });

  const [formData, setFormData] = useState({
    account: "",
    commodity: "",
    tradeType: "",
    lotSize: "",
    openDate: "",
    closeDate: "",
    profitLoss: "",
    entryPrice: "",
    exitPrice: "",
    rrr: "",
    equityBefore: "",
    equityAfter: "",
    strategy: "",
    comments: "",
    file: null,
    imageUrl: "",
    stopLoss: "",
    takeProfit: "",
    tags: "",
    tradeStatus: "open", // Default to open trade
  });

  // Load accounts data
  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    setAccounts(storedAccounts);
  }, []);

  // Handle trade status changes - this also updates field requirements
  const handleTradeStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      tradeStatus: status,
      // Clear closed trade fields if switching to open
      ...(status === "open"
        ? {
            closeDate: "",
            exitPrice: "",
            profitLoss: "",
            equityAfter: "",
          }
        : {}),
    }));

    // Reset validation errors when changing status
    setValidationErrors((prev) => ({
      ...prev,
      date: false,
      profit: false,
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      const selectedFile = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: selectedFile,
      }));

      // Create preview for image files
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      // Clear any related validation errors when user makes corrections
      if (
        (name === "openDate" || name === "closeDate") &&
        validationErrors.date
      ) {
        setValidationErrors((prev) => ({ ...prev, date: false }));
      }

      if (name === "profitLoss" && validationErrors.profit) {
        setValidationErrors((prev) => ({ ...prev, profit: false }));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const get_presigned_url = async (file) => {
    try {
      const response = await axios.post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/createImageLink",
        {
          body: {
            file_name: file.name,
            file_type: file.type,
          },
        }
      );

      if (response.status === 200) {
        const url = JSON.parse(response.data.body).url;
        return url;
      } else {
        console.error(
          "Failed to get presigned URL: Unexpected response status",
          response.status
        );
        return null;
      }
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      return null;
    }
  };
  const validateForm = () => {
    let isValid = true;
    const newValidationErrors = {
      date: false,
      profit: false,
      requiredFields: false,
    };

    // Different required fields based on trade status
    let requiredFields = [
      "account",
      "commodity",
      "tradeType",
      "lotSize",
      "openDate",
      "entryPrice",
      "equityBefore",
    ];

    // Add closed trade required fields
    if (formData.tradeStatus === "closed") {
      requiredFields = [
        ...requiredFields,
        "closeDate",
        "exitPrice",
        "equityAfter",
      ];

      // Validate dates only for closed trades
      if (formData.openDate && formData.closeDate) {
        const openDate = new Date(formData.openDate);
        const closeDate = new Date(formData.closeDate);

        if (closeDate < openDate) {
          newValidationErrors.date = true;
          isValid = false;
        }
      }

      // Validate profit/loss format only for closed trades
      if (
        formData.profitLoss &&
        !formData.profitLoss.toString().startsWith("+") &&
        !formData.profitLoss.toString().startsWith("-")
      ) {
        newValidationErrors.profit = true;
        isValid = false;
      }
    }

    // Check for missing required fields
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      newValidationErrors.requiredFields = true;
      isValid = false;
    }

    setValidationErrors(newValidationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      if (validationErrors.requiredFields) {
        setError("Please fill in all required fields marked with *");
      } else if (validationErrors.date) {
        setError("Close date must be after open date");
      } else if (validationErrors.profit) {
        setError("Profit/Loss must start with + or -");
      }
      return;
    }

    // Proceed with submission
    setIsSubmitting(true);

    //get the presigned URL for the file from the backend
    await get_presigned_url(formData.file).then(async (url) => {
      try {
        if (url) {
          await send_data_to_s3_bucket(url, formData.file).then(
            async (s3url) => {
              await send_trade_to_backend(s3url);
            }
          );
        }
      } catch (error) {
        console.error("Error uploading file to S3 bucket:", error);
      }

      setIsSubmitting(false);
    });
  };
  const send_data_to_s3_bucket = async (url, file) => {
    try {
      const responce = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      if (responce.status === 200) {
        return url.split("?")[0];
      } else {
        console.log(
          "Failed to upload file to S3 bucket: Unexpected response status",
          responce
        );
        console.error("Failed to upload file to S3 bucket:", responce.status);
        setError(
          "An error occured while processing your request. Please try again later."
        );
        throw new Error("Failed to upload file to S3 bucket");
      }
    } catch (error) {
      console.error("Error uploading file to S3 bucket:", error);
      throw error;
    }
  };

  const send_trade_to_backend = async (url) => {
    try {

      const tradeData = {type:"add_trade",
        body: {
          userId: 1,
          accountNumber: formData.account,
          commodity: formData.commodity,
          tradeType: formData.tradeType,
          lotSize: parseFloat(formData.lotSize),
          openDate: parseFloat(formData.openDate),
          closeDate: parseFloat(formData.closeDate),
          profitLoss: parseFloat(formData.profitLoss)|| 0,
          entryPrice: parseFloat(formData.entryPrice)|| 0,
          exitPrice: parseFloat(formData.exitPrice)|| 0,
          stopLoss: parseFloat(formData.stopLoss)|| 0,
          takeProfit: parseFloat(formData.takeProfit)|| 0,
          riskReward: formData.rrr,
          equityBefore: parseFloat(formData.equityBefore) || 0,
          equityAfter: parseFloat(formData.equityAfter) || 0,
          strategy: formData.strategy,
          comments: formData.comments,
          tags: " ",
          tradeLink: url,
        },
      }
      console.log("Trade data to be sent:", tradeData);
      const responce = await axios.post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/addtrade",tradeData
        
      );
      if (responce.status === 200) {
        console.log("Trade data sent successfully:", responce.data);
        return responce.data;
      } else {
        console.error(
          "Failed to send trade data: Unexpected response status",
          responce.status
        );
        setError(
          "An error occured while processing your request. Please try again later."
        );
        throw new Error("Failed to send trade data");
      }
    } catch (error) {
      console.error("Error sending trade data:", error);
      setError(
        "An error occured while processing your request. Please try again later."
      );
      throw error;
    }
  };

  const clearFileSelection = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setImagePreview(null);
  };

  // Form section renderer for better organization
  const renderFormSection = (title, fields) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields}</div>
    </div>
  );

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          New Trade Journal Entry
        </h2>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Trade Status Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trade Status
        </label>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => handleTradeStatusChange("open")}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md border ${
              formData.tradeStatus === "open"
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Activity className="mr-2 h-4 w-4" />
            Open Position
          </button>
          <button
            type="button"
            onClick={() => handleTradeStatusChange("closed")}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md border ${
              formData.tradeStatus === "closed"
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Closed Position
          </button>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Account & Basic Trade Information */}
        {renderFormSection(
          "Trade Details",
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account <span className="text-red-500">*</span>
              </label>
              <select
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Account</option>
                {accounts && accounts.length > 0 ? (
                  accounts.map((account, index) => (
                    <option key={index} value={account.account_number}>
                      {account.broker_name} ({account.account_number})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No accounts available
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commodity/Instrument <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="commodity"
                value={formData.commodity}
                onChange={handleChange}
                placeholder="e.g., EURUSD, Gold, AAPL"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trade Type <span className="text-red-500">*</span>
              </label>
              <select
                name="tradeType"
                value={formData.tradeType}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Trade Type</option>
                <option value="buy">Buy (Long)</option>
                <option value="sell">Sell (Short)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lot Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="lotSize"
                value={formData.lotSize}
                onChange={handleChange}
                placeholder="e.g., 0.01, 1.00, 5.00"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Trade Timing */}
        {renderFormSection(
          "Trade Timeline",
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Open Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="openDate"
                value={formData.openDate}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  validationErrors.date ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Close Date{" "}
                {formData.tradeStatus === "closed" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="date"
                name="closeDate"
                value={formData.closeDate}
                onChange={handleChange}
                disabled={formData.tradeStatus === "open"}
                className={`mt-1 block w-full px-3 py-2 border ${
                  validationErrors.date ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formData.tradeStatus === "open"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {validationErrors.date && (
                <p className="mt-1 text-sm text-red-600">
                  Close date must be after open date
                </p>
              )}
            </div>
          </>
        )}

        {/* Price & Performance Information */}
        {renderFormSection(
          "Price Information",
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Entry Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.00001"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleChange}
                placeholder="Entry price"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Exit Price{" "}
                {formData.tradeStatus === "closed" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="number"
                step="0.00001"
                name="exitPrice"
                value={formData.exitPrice}
                onChange={handleChange}
                placeholder="Exit price"
                disabled={formData.tradeStatus === "open"}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formData.tradeStatus === "open"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profit / Loss{" "}
                {formData.tradeStatus === "closed" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                name="profitLoss"
                value={formData.profitLoss}
                onChange={handleChange}
                placeholder="e.g., +250.50 or -125.75"
                disabled={formData.tradeStatus === "open"}
                className={`mt-1 block w-full px-3 py-2 border ${
                  validationErrors.profit ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formData.tradeStatus === "open"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {validationErrors.profit && (
                <p className="mt-1 text-sm text-red-600">
                  Start with + for profit or - for loss
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Risk-Reward Ratio
              </label>
              <input
                type="text"
                name="rrr"
                value={formData.rrr}
                onChange={handleChange}
                placeholder="e.g., 1:2, 1:3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Account Performance */}
        {renderFormSection(
          "Account Performance",
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stop Loss <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="stopLoss"
                value={formData.stopLoss}
                onChange={handleChange}
                placeholder="Stop loss amount"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Take Profit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="takeProfit"
                value={formData.takeProfit}
                onChange={handleChange}
                placeholder="Take profit amount"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Equity Before{" "}
              </label>
              <input
                type="number"
                step="0.01"
                name="equityBefore"
                value={formData.equityBefore}
                onChange={handleChange}
                placeholder="Account equity before trade"
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 `}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Equity After{" "}
                {formData.tradeStatus === "closed" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                name="equityAfter"
                value={formData.equityAfter}
                onChange={handleChange}
                placeholder="Account equity after trade"
                disabled={formData.tradeStatus === "open"}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formData.tradeStatus === "open"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </>
        )}

        {/* Analysis & Notes */}
        {renderFormSection(
          "Analysis & Documentation",
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Strategy
              </label>
              <input
                type="text"
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                placeholder="e.g., Breakout, Trend Following, Mean Reversion"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Comments & Trade Analysis
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder={
                  formData.tradeStatus === "open"
                    ? "Trade setup, entry criteria, stop loss placement, targets..."
                    : "What was your reasoning? What went well or poorly? What would you do differently?"
                }
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade Documentation
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload Option */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Upload Screenshot
                  </label>
                  <div className="flex items-center">
                    <label className="cursor-pointer flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <FileText className="mr-2 h-5 w-5 text-gray-500" />
                      {formData.file
                        ? formData.file.name.substring(0, 20) +
                          (formData.file.name.length > 20 ? "..." : "")
                        : "Select file"}
                      <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                    {formData.file && (
                      <button
                        type="button"
                        onClick={clearFileSelection}
                        className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-100"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Image URL Option */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Or Enter Image URL
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/chart.jpg"
                        className="pl-10 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {(imagePreview || formData.imageUrl) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </p>
                  <div className="border border-gray-300 rounded-md p-2 bg-white">
                    <img
                      src={
                        imagePreview ||
                        formData.imageUrl ||
                        "/api/placeholder/400/300"
                      }
                      alt="Trade screenshot"
                      className="max-h-64 mx-auto object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                {formData.tradeStatus === "open"
                  ? "Save Open Position"
                  : "Record Closed Trade"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Ensure this is at the top level of the module
export default AddTradeForm;
