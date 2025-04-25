import React from "react";
import TotalProfit from "./TotalProfit";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSkeleton from "./LoadingSkeleton";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Clock,
  DollarSign,
  Scale,
  Target,
  AlertCircle,
  ChartCandlestick,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
} from "recharts";
const COLORS = ["#10B981", "#EF4444"];
import RecentTrades from "./RecentTrades";
import Select from "react-select";

const BodyContent = (props) => {
  const [trades, setTrades] = useState([]);

  const bgColor = props.isDark ? "bg-gray-800" : "bg-white";
  const textColor = props.isDark ? "text-gray-200" : "text-gray-800";
  const secondaryTextColor = props.isDark ? "text-gray-4s00" : "text-gray-500";
  const borderColor = props.isDark ? "border-gray-700" : "border-gray-200";
  const dividerColor = props.isDark ? "divide-gray-700" : "divide-gray-100";
  const chartBgColor = props.isDark ? "bg-gray-700" : "bg-gray-50";

  const hoverBgColor = props.isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const pageBackground = props.isDark ? "bg-gray-900" : "bg-gray-100";

  const [selectedAccount, setSelectedAccount] = useState(null);

  const [loading, setLoading] = useState(true); //for the loading state
  const accounts = JSON.parse(localStorage.getItem("accounts"));
  const [dateFilter, setDateFilter] = useState("7");
  const [filteredTrades, setFilteredTrades] = useState(trades); //for the date filter
  const [depositsWithdrawals, setDepositsWithdrawals] = useState([]); //for the deposits and withdrawals\
  const [depositWithdrawalData, setDepositWithdrawalData] = useState([]);

  //for the date filter
  //for filterring dates
  useEffect(() => {
    const filterTradesByDate = () => {
      const today = new Date();

      if (dateFilter === "7") {
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        setFilteredTrades(
          trades.filter((trade) => new Date(trade.open_date) >= last7Days)
        );
      } else if (dateFilter === "30") {
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 30);
        setFilteredTrades(
          trades.filter((trade) => new Date(trade.open_date) >= last7Days)
        );
      } else if (dateFilter === "90") {
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 90);
        setFilteredTrades(
          trades.filter((trade) => new Date(trade.open_date) >= last7Days)
        );
      } else if (dateFilter === "1 year") {
        console.log("1 year");
        const last1Year = new Date();
        last1Year.setFullYear(last1Year.getFullYear() - 1);
        setFilteredTrades(
          trades.filter((trade) => new Date(trade.open_date) >= last1Year)
        );
      } else if (dateFilter === "allTime") {
        setFilteredTrades(trades);
      }
    };
    filterTradesByDate();
  }, [dateFilter, trades]);

  const lastFiveTrades = trades.slice(-5); //for the last five trades

  useEffect(() => {
    if (accounts && accounts.length > 0) {
      // Set default selected account
      setSelectedAccount({
        value: accounts[0].account_number,
        label: (
          <div className="flex items-center">
            <ChartCandlestick className="mr-2" size={20} />
            {accounts[0].broker_name} ({accounts[0].account_number})
          </div>
        ),
      });

      // Get trades for the default account
      get_trades_from_Selected_Account(accounts[0].account_number);
    }
  }, []);

  const winLossData = [
    {
      name: "Wins",
      value: trades.filter((t) => t.profit_loss > 0).length,
    },
    {
      name: "Losses",
      value: trades.filter((t) => t.profit_loss < 0).length,
    },
  ];

  const [profitOverTime, setProfitOverTime] = useState([]);

  useEffect(() => {
    const getCumulativeProfitData = () => {
      const sortedTrades = [...filteredTrades].sort(
        (a, b) => new Date(a.open_date) - new Date(b.open_date)
      );

      let cumulative = 0;
      return sortedTrades.map((trade) => {
        cumulative += trade.profit_loss;
        return {
          date: trade.open_date, // using open_date
          profit: cumulative,
        };
      });
    };

    setProfitOverTime(getCumulativeProfitData());
  }, [filteredTrades, trades]);



  useEffect(() => {
    if (selectedAccount) {
      get_trades_from_Selected_Account(selectedAccount.value);
      get_deposits_withdrawals_from_Selected_Account(selectedAccount.value); // Fetch deposits and withdrawals when account changes
    }
  }, [selectedAccount]);

  const get_trades_from_Selected_Account = async (accountNumber) => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const response = await axios.post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
        {
          type: "get_trades",
          body: { email: 1, account_number: accountNumber },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.body) {
        const data = JSON.parse(response.data.body);
        setTrades(data.trades); // Update state with new trades
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setLoading(false);
    }
  };
  const get_deposits_withdrawals_from_Selected_Account = async (
    accountNumber
  ) => {
    try {
      setLoading(true); // Set loading to true when fetching data
      const response = await axios.post(
        "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
        {
          type: "get_deposits_withdrawals_from_Selected_Account",
          body: { email: 1, account_number: accountNumber },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 && response.data.body) {
        const data = JSON.parse(response.data.body);
        setDepositsWithdrawals(data.trades);
        // Update state with new trades
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };
  useEffect(() => {
    console.log("Deposits and Withdrawals", depositsWithdrawals);
    const totalDeposits = depositsWithdrawals
      .filter((t) => t.type === "DEPOSIT")
      .reduce((sum, t) => sum + t.amount, 0);
      
      const totalWithdrawals = depositsWithdrawals
      .filter((t) => t.type === "WITHDRAWAL")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    

    setDepositWithdrawalData([
      { name: "Deposits", amount: totalDeposits },
      { name: "Withdrawals", amount: totalWithdrawals },
    ]);

    setLoading(false);
  }, [depositsWithdrawals]);
  const accountOptions = accounts.map((account) => ({
    value: account.account_number,
    label: (
      <div className="flex items-center">
        <ChartCandlestick className="mr-2" size={20} /> {/* Icon here */}
        {account.broker_name} ({account.account_number})
      </div>
    ),
  }));

  return (
    <>
      {loading ? (
        <LoadingSkeleton isDark={props.isDark} />
      ) : (
        <div className={`p-6`}>
          <div className={`w-full h-full p-6 overflow-auto ${pageBackground}`}>
            <h1
              className={`text-2xl font-bold ${textColor} mb-6 mt-10 md:mt-0`}
            >
              Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <Select
                options={accountOptions}
                className={`react-select-container mb-6  w-xs ${
                  props.isDark ? "dark" : "light"
                }`}
                classNamePrefix="react-select"
                value={selectedAccount}
                onChange={(selectedOption) =>
                  setSelectedAccount(selectedOption)
                }
              />

              <Select
                options={accountOptions}
                className={`react-select-container mb-6  w-xs ${
                  props.isDark ? "dark" : "light"
                }`}
                classNamePrefix="react-select"
              />

              <Select
                options={accountOptions}
                className={`react-select-container mb-6  w-xs ${
                  props.isDark ? "dark" : "light"
                }`}
                classNamePrefix="react-select"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <BarChart3
                    size={20}
                    className={props.isDark ? "text-blue-400" : "text-blue-500"}
                  />
                }
                title="Total Trades"
              />
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <TrendingUp
                    size={20}
                    className={
                      props.isDark ? "text-green-400" : "text-green-500"
                    }
                  />
                }
                title="Win Rate"
              />
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <DollarSign
                    size={20}
                    className={
                      props.isDark ? "text-purple-400" : "text-purple-500"
                    }
                  />
                }
                title="Average Profit/Loss"
              />
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <PieChart
                    size={20}
                    className={
                      props.isDark ? "text-orange-400" : "text-orange-500"
                    }
                  />
                }
                title="Net P&L"
              />

              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <Scale
                    size={20}
                    className={
                      props.isDark ? "text-yellow-400" : "text-yellow-500"
                    }
                  />
                }
                title="Risk-Reward Ratio"
              />
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <TrendingDown
                    size={20}
                    className={props.isDark ? "text-red-400" : "text-red-500"}
                  />
                }
                title="Max Drawdown"
              />
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <Clock
                    size={20}
                    className={props.isDark ? "text-cyan-400" : "text-cyan-500"}
                  />
                }
                title="Average Holding Time"
              />
              <TotalProfit
                isDark={props.isDark}
                data={trades}
                icon={
                  <BarChart3
                    size={20}
                    className={props.isDark ? "text-blue-400" : "text-blue-500"}
                  />
                }
                title="Best/Worst Trade"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Charts Section - Takes up 3/5 of the grid */}
            <div className="xl:col-span-3 space-y-6">
              {/* Performance Chart */}
              <div className={`${bgColor} rounded-lg shadow p-4`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-lg font-medium ${textColor}`}>
                    Profit Overtime
                  </h2>
                  <select
                    className={`text-sm border rounded-md p-1 ${
                      props.isDark
                        ? "bg-gray-700 border-gray-600 text-gray-300"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value={"7"}>Last 7 Days</option>
                    <option value={"30"}>Last 30 Days</option>
                    <option value={"90"}>Last 90 Days</option>
                    <option value={"1 year"}>Last 1 Year</option>
                    <option value={"allTime"}>All Time</option>
                  </select>
                </div>
                {/* Chart placeholder - same height as Win/Loss Distribution */}

                <div
                  className={`${chartBgColor} h-[300px] rounded-md flex items-center justify-center`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={`${bgColor} rounded-lg shadow`}>
                <div className={`p-4 border-b ${borderColor}`}>
                  <h2 className={`text-lg font-medium ${textColor}`}>
                    Recent Trades
                  </h2>
                </div>
                <div
                  className={`divide-y ${dividerColor} max-h-56 overflow-y-auto`}
                >
                  {lastFiveTrades.map((trade) => (
                    <RecentTrades
                      key={trade.id}
                      trade={trade}
                      isDark={props.isDark}
                    />
                  ))}
                </div>

                <div className={`p-3 border-t ${borderColor}`}>
                  <button
                    className={`text-sm ${
                      props.isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    } font-medium`}
                  >
                    View trade history
                  </button>
                </div>
              </div>
            </div>

            {/* Side Section - Takes up 2/5 of the grid (increased from 1/3) */}
            <div className="xl:col-span-2 space-y-6">
              {/* Win/Loss Distribution - same height as Performance Overview */}
              <div className={`${bgColor} rounded-lg shadow p-4`}>
                <h2 className={`text-lg font-medium mb-4 ${textColor}`}>
                  Win/Loss Distribution
                </h2>
                {/* Chart placeholder - same height as Performance Overview */}
                <div
                  className={`${chartBgColor} h-64 rounded-md flex items-center justify-center`}
                >
                  <PieChart width={400} height={300}>
                    <Pie
                      innerRadius={60}
                      outerRadius={100}
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      stroke="#fff"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {winLossData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div
                    className={`text-center p-2 ${
                      props.isDark ? "bg-green-900" : "bg-green-50"
                    } rounded-md`}
                  >
                    <p className={`text-sm ${secondaryTextColor}`}>Wins</p>
                    <p
                      className={`text-lg font-bold ${
                        props.isDark ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {trades.filter((t) => t.profit_loss > 0).length}
                    </p>
                  </div>
                  <div
                    className={`text-center p-2 ${
                      props.isDark ? "bg-red-900" : "bg-red-50"
                    } rounded-md`}
                  >
                    <p className={`text-sm ${secondaryTextColor}`}>Losses</p>
                    <p
                      className={`text-lg font-bold ${
                        props.isDark ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {trades.filter((t) => t.profit_loss < 0).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Events - Now wider */}
              <div className={`${bgColor} rounded-lg shadow`}>
                <div className={`p-4 border-b ${borderColor}`}>
                  <h2 className={`text-lg font-medium ${textColor}`}>
                    Upcoming Market Events
                  </h2>
                </div>
                <div
                  className={`divide-y ${dividerColor} max-h-56 overflow-y-auto`}
                >
                  <div
                  className={`${chartBgColor} h-64 rounded-md flex items-center justify-center`}
                >
                 
                  <PieChart width={400} height={300}>
                    <Pie
                      innerRadius={60}
                      outerRadius={100}
                      data={depositWithdrawalData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      stroke="#fff"
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {winLossData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  </div>
                </div>
                <div className={`p-3 border-t ${borderColor}`}>
                  <button
                    className={`text-sm ${
                      props.isDark
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-800"
                    } font-medium`}
                  >
                    View economic calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BodyContent;
