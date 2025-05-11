import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  Eye,
  Calendar,
  DollarSign,
  PieChart,
  Activity,
} from "lucide-react";
import axios from "axios";

const TradesList = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("openDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCommodity, setFilterCommodity] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [uniqueCommodities, setUniqueCommodities] = useState([]);

  useEffect(() => {
    // Load accounts from localStorage
    const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    setAccounts(storedAccounts);

    // Fetch trades from API
    fetchTrades(storedAccounts[0].account_number);
  }, []);

  const fetchTrades = async (accountNumber) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
        {
          type: "get_trades",
          body: { email: 1, account_number: accountNumber },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const tradesData = JSON.parse(response.data.body).trades;
        console.log("Fetched trades:", tradesData);
        setTrades(tradesData);

        // Extract unique commodities for filtering
        const commodities = [
          ...new Set(tradesData.map((trade) => trade.commodity)),
        ];

        setUniqueCommodities(commodities);
      } else {
        setError("Failed to fetch trades");
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
      setError("An error occurred while fetching your trades");
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply sorting and filtering to trades
  const getFilteredAndSortedTrades = () => {
    let filteredTrades = [...trades];

    // Apply status filter
    if (filterStatus !== "all") {
      filteredTrades = filteredTrades.filter(
        (trade) => trade.trade_status === filterStatus
      );
    }

    // Apply commodity filter
    if (filterCommodity) {
      filteredTrades = filteredTrades.filter(
        (trade) => trade.commodity === filterCommodity
      );
    }

    // Apply account filter
    if (filterAccount) {
      filteredTrades = filteredTrades.filter(
        (trade) => trade.account_number === filterAccount
      );
    }

    // Apply sorting
    filteredTrades.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date fields
      if (sortField === "open_date" || sortField === "close_date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric fields
      if (["entry_price", "exit_price", "lot_size"].includes(sortField)) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredTrades;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format profit/loss with color and sign
  const formatProfitLoss = (value, id) => {
  
    if (!value) return "-";
    const amount = parseFloat(value);
    const isPositive = amount >= 0;
    return (
      <span className={isPositive ? "text-green-600" : "text-red-600"}>
        {isPositive ? "+" : ""}
        {amount.toFixed(2)}
      </span>
    );
  };

  const filteredAndSortedTrades = getFilteredAndSortedTrades();

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Trade Journal</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {showFilters ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
            Filter Trades
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Trades</option>
                <option value="open">Open Positions</option>
                <option value="closed">Closed Trades</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commodity/Instrument
              </label>
              <select
                value={filterCommodity}
                onChange={(e) => setFilterCommodity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Commodities</option>
                {uniqueCommodities.map((commodity, index) => (
                  <option key={index} value={commodity}>
                    {commodity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Accounts</option>
                {accounts.map((account, index) => (
                  <option key={index} value={account.account_number}>
                    {account.broker_name} ({account.account_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterCommodity("");
                setFilterAccount("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md mr-2 text-sm font-medium hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Trades Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your trades...</p>
          </div>
        ) : filteredAndSortedTrades.length === 0 ? (
          <div className="p-8 text-center">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No trades found
            </h3>
            <p className="text-gray-500 mb-4">
              {filterStatus !== "all" || filterCommodity || filterAccount
                ? "Try changing your filters or add a new trade."
                : "Start by adding your first trade to your journal."}
            </p>
            <a
              href="/add-trade"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Trade
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("openDate")}
                  >
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("commodity")}
                  >
                    <div className="flex items-center">
                      Instrument
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Direction
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("lot_size")}
                  >
                    <div className="flex items-center">
                      Size
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("entry_price")}
                  >
                    <div className="flex items-center">
                      Entry
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("profit_loss")}
                  >
                    <div className="flex items-center">
                      P/L
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedTrades.map((trade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trade.tradeStatus === "open"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {trade.tradeStatus === "open" ? (
                          <>
                            <Activity className="h-3 w-3 mr-1" /> Open
                          </>
                        ) : (
                          <>
                            <Calendar className="h-3 w-3 mr-1" /> Closed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(trade.open_date)}</div>
                      {trade.close_date && (
                        <div className="text-xs text-gray-400">
                          to {formatDate(trade.close_date)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {trade.commodity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`font-medium ${
                          trade.trade_type === "buy"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {trade.trade_type === "buy" ? "LONG" : "SHORT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trade.lot_size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trade.entry_price}
                      {trade.exit_price && (
                        <div className="text-xs text-gray-400">
                          Exit: {trade.exit_price}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {trade.trade_status === "closed" ? (
                        formatProfitLoss(trade.profit_loss, trade.id)
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          
                      <Link
                       to={`/view-trade/${trade.id}`} state={{ trade }}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradesList;
