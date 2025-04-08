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

const Dashboard = ({ isDark = false }) => {
  // Mock data for trading stats
  const tradingStats = [
    { title: "Total Trades", value: "347", change: "+12.2%", isPositive: true, icon: <BarChart3 size={20} className={isDark ? "text-blue-400" : "text-blue-500"} /> },
    { title: "Win Rate (%)", value: "62.4%", change: "+1.8%", isPositive: true, icon: <TrendingUp size={20} className={isDark ? "text-green-400" : "text-green-500"} /> },
    { title: "Average Profit/Loss", value: "$142.50", change: "+$7.30", isPositive: true, icon: <DollarSign size={20} className={isDark ? "text-purple-400" : "text-purple-500"} /> },
    { title: "Net P&L", value: "$24,780", change: "+18.2%", isPositive: true, icon: <PieChart size={20} className={isDark ? "text-orange-400" : "text-orange-500"} /> },
    { title: "Risk-Reward Ratio", value: "2.4:1", change: "+0.3", isPositive: true, icon: <Scale size={20} className={isDark ? "text-yellow-400" : "text-yellow-500"} /> },
    { title: "Max Drawdown", value: "-$3,850", change: "-$650", isPositive: false, icon: <TrendingDown size={20} className={isDark ? "text-red-400" : "text-red-500"} /> },
    { title: "Average Holding Time", value: "3.2 days", change: "-0.5 days", isPositive: true, icon: <Clock size={20} className={isDark ? "text-cyan-400" : "text-cyan-500"} /> },
    { title: "Best/Worst Trade", value: "+$1,240 / -$680", icon: <LineChart size={20} className={isDark ? "text-indigo-400" : "text-indigo-500"} /> },
  ];

  // Mock data for recent trades
  const recentTrades = [
    { id: 1, symbol: "AAPL", action: "BUY", price: "$178.42", quantity: "25", time: "2 hours ago", profit: "+$245.50", isPositive: true },
    { id: 2, symbol: "MSFT", action: "SELL", price: "$412.65", quantity: "10", time: "4 hours ago", profit: "+$320.80", isPositive: true },
    { id: 3, symbol: "TSLA", action: "BUY", price: "$175.28", quantity: "15", time: "1 day ago", profit: "-$125.40", isPositive: false },
    { id: 4, symbol: "NVDA", action: "SELL", price: "$925.15", quantity: "5", time: "2 days ago", profit: "+$478.25", isPositive: true },
  ];

  // Mock data for upcoming market events
  const marketEvents = [
    { id: 1, title: "FOMC Meeting", date: "Tomorrow, 2:00 PM", type: 'economic' },
    { id: 2, title: "AAPL Earnings", date: "Apr 12, 4:30 PM", type: 'earnings' },
    { id: 3, title: "CPI Data Release", date: "Apr 15, 8:30 AM", type: 'economic' },
    { id: 4, title: "MSFT Earnings", date: "Apr 18, 4:00 PM", type: 'earnings' }
  ];

  // Theme-specific class assignments
  const bgColor = isDark ? "bg-gray-800" : "bg-white";
  const textColor = isDark ? "text-gray-200" : "text-gray-800";
  const secondaryTextColor = isDark ? "text-gray-400" : "text-gray-500";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const dividerColor = isDark ? "divide-gray-700" : "divide-gray-100";
  const chartBgColor = isDark ? "bg-gray-700" : "bg-gray-50";
  const chartIconColor = isDark ? "text-gray-500" : "text-gray-400";
  const hoverBgColor = isDark ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const pageBackground = isDark ? "bg-gray-900" : "bg-gray-100";

  return (
    <div className={`w-full h-full p-6 overflow-auto ${pageBackground}`}>
      <h1 className={`text-2xl font-bold ${textColor} mb-6 mt-10 md:mt-0`}>Dashboard</h1>
      
      {/* Trading Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {tradingStats.map((stat, index) => (
          <div key={index} className={`${bgColor} rounded-lg shadow p-4`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-sm font-medium ${secondaryTextColor}`}>{stat.title}</h3>
              {stat.icon}
            </div>
            <div className="flex items-baseline">
              <p className={`text-xl font-semibold ${textColor}`}>{stat.value}</p>
              {stat.change && (
                <span className={`ml-2 text-sm flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Charts Section - Takes up 3/5 of the grid */}
        <div className="xl:col-span-3 space-y-6">
          {/* Performance Chart */}
          <div className={`${bgColor} rounded-lg shadow p-4`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-medium ${textColor}`}>Performance Overview</h2>
              <select className={`text-sm border rounded-md p-1 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            {/* Chart placeholder - same height as Win/Loss Distribution */}
            <div className={`${chartBgColor} h-64 rounded-md flex items-center justify-center`}>
              <LineChart size={40} className={chartIconColor} />
            </div>
          </div>
          <div className={`${bgColor} rounded-lg shadow`}>
            <div className={`p-4 border-b ${borderColor}`}>
              <h2 className={`text-lg font-medium ${textColor}`}>Recent Trades</h2>
            </div>
            <div className={`divide-y ${dividerColor} max-h-56 overflow-y-auto`}>
              {recentTrades.map((trade) => (
                <div key={trade.id} className={`p-3 ${hoverBgColor}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${trade.action === 'BUY' 
                        ? isDark ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'
                        : isDark ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600'}`}>
                      {trade.action === 'BUY' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`font-medium ${textColor}`}>{trade.symbol}</p>
                        <span className={`font-medium ${trade.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.profit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <p className={`text-xs ${secondaryTextColor}`}>{trade.quantity} @ {trade.price}</p>
                        <p className={`text-xs ${secondaryTextColor}`}>{trade.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 border-t ${borderColor}`}>
              <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}>View trade history</button>
            </div>
          </div>
        </div>

        {/* Side Section - Takes up 2/5 of the grid (increased from 1/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Win/Loss Distribution - same height as Performance Overview */}
          <div className={`${bgColor} rounded-lg shadow p-4`}>
            <h2 className={`text-lg font-medium mb-4 ${textColor}`}>Win/Loss Distribution</h2>
            {/* Chart placeholder - same height as Performance Overview */}
            <div className={`${chartBgColor} h-64 rounded-md flex items-center justify-center`}>
              <PieChart size={40} className={chartIconColor} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`text-center p-2 ${isDark ? 'bg-green-900' : 'bg-green-50'} rounded-md`}>
                <p className={`text-sm ${secondaryTextColor}`}>Wins</p>
                <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>217</p>
              </div>
              <div className={`text-center p-2 ${isDark ? 'bg-red-900' : 'bg-red-50'} rounded-md`}>
                <p className={`text-sm ${secondaryTextColor}`}>Losses</p>
                <p className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>130</p>
              </div>
            </div>
          </div>
          
          {/* Market Events - Now wider */}
          <div className={`${bgColor} rounded-lg shadow`}>
            <div className={`p-4 border-b ${borderColor}`}>
              <h2 className={`text-lg font-medium ${textColor}`}>Upcoming Market Events</h2>
            </div>
            <div className={`divide-y ${dividerColor} max-h-56 overflow-y-auto`}>
              {marketEvents.map((event) => (
                <div key={event.id} className={`p-3 ${hoverBgColor}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${event.type === 'economic' 
                        ? isDark ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-500'
                        : event.type === 'earnings' 
                          ? isDark ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-500'
                          : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {event.type === 'economic' ? <AlertCircle size={16} /> : <Target size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${textColor}`}>{event.title}</p>
                      <p className={`text-xs ${secondaryTextColor}`}>{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 border-t ${borderColor}`}>
              <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}>View economic calendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;