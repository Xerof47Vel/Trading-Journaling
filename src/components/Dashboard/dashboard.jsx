import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Clock,
  DollarSign,
  PieChart,
  Scale,
  LineChart,
  Target,
  AlertCircle
} from 'lucide-react';
import BodyContent from './BodyContent.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Dashboard = (props) => {
  // Mock data for trading stats
  // const tradingStats = [
  //   { title: "Total Trades", value: "347", change: "+12.2%", isPositive: true, icon: <BarChart3 size={20} className={isDark ? "text-blue-400" : "text-blue-500"} /> },
  //   { title: "Win Rate (%)", value: "62.4%", change: "+1.8%", isPositive: true, icon: <TrendingUp size={20} className={isDark ? "text-green-400" : "text-green-500"} /> },
  //   { title: "Average Profit/Loss", value: "$142.50", change: "+$7.30", isPositive: true, icon: <DollarSign size={20} className={isDark ? "text-purple-400" : "text-purple-500"} /> },
  //   { title: "Net P&L", value: "$24,780", change: "+18.2%", isPositive: true, icon: <PieChart size={20} className={isDark ? "text-orange-400" : "text-orange-500"} /> },
  //   { title: "Risk-Reward Ratio", value: "2.4:1", change: "+0.3", isPositive: true, icon: <Scale size={20} className={isDark ? "text-yellow-400" : "text-yellow-500"} /> },
  //   { title: "Max Drawdown", value: "-$3,850", change: "-$650", isPositive: false, icon: <TrendingDown size={20} className={isDark ? "text-red-400" : "text-red-500"} /> },
  //   { title: "Average Holding Time", value: "3.2 days", change: "-0.5 days", isPositive: true, icon: <Clock size={20} className={isDark ? "text-cyan-400" : "text-cyan-500"} /> },
  //   { title: "Best/Worst Trade", value: "+$1,240 / -$680", icon: <LineChart size={20} className={isDark ? "text-indigo-400" : "text-indigo-500"} /> },
  // ];

  // // Mock data for recent trades
  // const recentTrades = [
  //   { id: 1, symbol: "AAPL", action: "BUY", price: "$178.42", quantity: "25", time: "2 hours ago", profit: "+$245.50", isPositive: true },
  //   { id: 2, symbol: "MSFT", action: "SELL", price: "$412.65", quantity: "10", time: "4 hours ago", profit: "+$320.80", isPositive: true },
  //   { id: 3, symbol: "TSLA", action: "BUY", price: "$175.28", quantity: "15", time: "1 day ago", profit: "-$125.40", isPositive: false },
  //   { id: 4, symbol: "NVDA", action: "SELL", price: "$925.15", quantity: "5", time: "2 days ago", profit: "+$478.25", isPositive: true },
  // ];

  // // Mock data for upcoming market events
  // const marketEvents = [
  //   { id: 1, title: "FOMC Meeting", date: "Tomorrow, 2:00 PM", type: 'economic' },
  //   { id: 2, title: "AAPL Earnings", date: "Apr 12, 4:30 PM", type: 'earnings' },
  //   { id: 3, title: "CPI Data Release", date: "Apr 15, 8:30 AM", type: 'economic' },
  //   { id: 4, title: "MSFT Earnings", date: "Apr 18, 4:00 PM", type: 'earnings' }
  // ];

  // // Theme-specific class assignments
  // const bgColor = isDark ? "bg-gray-800" : "bg-white";
  // const textColor = isDark ? "text-gray-200" : "text-gray-800";
  // const secondaryTextColor = isDark ? "text-gray-400" : "text-gray-500";
  // const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  // const dividerColor = isDark ? "divide-gray-700" : "divide-gray-100";
  // const chartBgColor = isDark ? "bg-gray-700" : "bg-gray-50";
  // const chartIconColor = isDark ? "text-gray-500" : "text-gray-400";
  // const hoverBgColor = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";
  // const pageBackground = isDark ? "bg-gray-900" : "bg-gray-100";

  const [getInfo, setInfo] = useState({ isDark: props.isDark, data: [] });
  const [loading, setLoading] = useState(true); //// Initialize as an empty array

  const getDataFromApi = async () => {
      try {
          const response = await axios.post(
              "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/getTrades",
              { type: "get_trades", body: { userId: 1 } }, // Send JSON directly
              { headers: { "Content-Type": "application/json" } } // Ensure proper headers
          );

          if (response.status === 200 && response.data.body) {
              const data= JSON.parse(response.data.body);
              setInfo((prevInfo) => ({
                ...prevInfo,
                data: [...prevInfo.data, ...data.trades],
              }));
              console.log("Fetched data:", data.trades);
              setLoading(false); // Set loading to false after data fetch
          }
      } catch (error) {
          console.error("Error fetching data:", error);

      }
      finally {
          setLoading(false); // Set loading to false after data fetch
      }
  };

  // Fetch data only once when component mounts
  useEffect(() => {
      getDataFromApi();
  }, []);

  return (
      <div>
         {loading ? (
              <p>Loading trades...</p>
          ) : getInfo.data.length > 1 ? (
              <BodyContent data={getInfo}></BodyContent>
              
          ) : (
              <p>No trades found.</p>
          )}
      </div>
  );



};

export default Dashboard;