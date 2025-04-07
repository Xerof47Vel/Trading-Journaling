import React from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar
} from 'lucide-react';

const Dashboard = ({ isDark = false }) => {
  // Mock data for stats
  const stats = [
    { title: "Total Users", value: "12,361", change: "+2.5%", isPositive: true, icon: <Users size={20} className={isDark ? "text-blue-400" : "text-blue-500"} /> },
    { title: "Revenue", value: "$24,780", change: "+18.2%", isPositive: true, icon: <BarChart3 size={20} className={isDark ? "text-green-400" : "text-green-500"} /> },
    { title: "Active Sessions", value: "1,432", change: "+4.3%", isPositive: true, icon: <Activity size={20} className={isDark ? "text-purple-400" : "text-purple-500"} /> },
    { title: "Conversion Rate", value: "3.68%", change: "-0.5%", isPositive: false, icon: <TrendingUp size={20} className={isDark ? "text-orange-400" : "text-orange-500"} /> },
  ];

  // Mock data for recent activity
  const activities = [
    { id: 1, user: "Jane Cooper", action: "Created a new project", time: "2 minutes ago" },
    { id: 2, user: "Alex Morgan", action: "Completed task #4321", time: "1 hour ago" },
    { id: 3, user: "Michael Scott", action: "Added new team member", time: "3 hours ago" },
    { id: 4, user: "Emily Johnson", action: "Updated dashboard design", time: "5 hours ago" },
  ];

  // Mock data for upcoming events
  const events = [
    { id: 1, title: "Marketing Meeting", date: "Today, 2:00 PM", type: "meeting" },
    { id: 2, title: "Product Launch", date: "Tomorrow, 10:00 AM", type: "event" },
    { id: 3, title: "Q2 Review", date: "Apr 10, 9:00 AM", type: "meeting" },
    { id: 4, title: "Team Building", date: "Apr 15, 3:00 PM", type: "other" }
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
      <h1 className={`text-2xl font-bold ${textColor} mb-6`}>Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${bgColor} rounded-lg shadow p-4`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-sm font-medium ${secondaryTextColor}`}>{stat.title}</h3>
              {stat.icon}
            </div>
            <div className="flex items-baseline">
              <p className={`text-xl font-semibold ${textColor}`}>{stat.value}</p>
              <span className={`ml-2 text-sm flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts Section - Takes up 2/3 of the grid */}
        <div className="xl:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className={`${bgColor} rounded-lg shadow p-4`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-medium ${textColor}`}>Revenue Overview</h2>
              <select className={`text-sm border rounded-md p-1 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            {/* Chart placeholder */}
            <div className={`${chartBgColor} h-56 rounded-md flex items-center justify-center`}>
              <BarChart3 size={40} className={chartIconColor} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`${bgColor} rounded-lg shadow`}>
            <div className={`p-4 border-b ${borderColor}`}>
              <h2 className={`text-lg font-medium ${textColor}`}>Recent Activity</h2>
            </div>
            <div className={`divide-y ${dividerColor} max-h-64 overflow-y-auto`}>
              {activities.map((activity) => (
                <div key={activity.id} className={`p-3 ${hoverBgColor}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${isDark ? 'bg-blue-900' : 'bg-blue-100'} rounded-full flex items-center justify-center ${isDark ? 'text-blue-400' : 'text-blue-500'} mr-3`}>
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${textColor}`}>{activity.user}</p>
                      <p className={`text-sm ${secondaryTextColor}`}>{activity.action}</p>
                    </div>
                    <div className={`flex items-center text-xs ${secondaryTextColor}`}>
                      <Clock size={12} className="mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`p-3 border-t ${borderColor}`}>
              <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}>View all activity</button>
            </div>
          </div>
        </div>

        {/* Side Section - Takes up 1/3 of the grid */}
        <div className="space-y-6">
          {/* User Growth */}
          <div className={`${bgColor} rounded-lg shadow p-4`}>
            <h2 className={`text-lg font-medium mb-4 ${textColor}`}>User Growth</h2>
            {/* Chart placeholder */}
            <div className={`${chartBgColor} h-40 rounded-md flex items-center justify-center`}>
              <TrendingUp size={32} className={chartIconColor} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className={`text-center p-2 ${isDark ? 'bg-blue-900' : 'bg-blue-50'} rounded-md`}>
                <p className={`text-sm ${secondaryTextColor}`}>New Users</p>
                <p className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>+643</p>
              </div>
              <div className={`text-center p-2 ${isDark ? 'bg-green-900' : 'bg-green-50'} rounded-md`}>
                <p className={`text-sm ${secondaryTextColor}`}>Growth</p>
                <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>+5.2%</p>
              </div>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className={`${bgColor} rounded-lg shadow`}>
            <div className={`p-4 border-b ${borderColor}`}>
              <h2 className={`text-lg font-medium ${textColor}`}>Upcoming Events</h2>
            </div>
            <div className={`divide-y ${dividerColor} max-h-48 overflow-y-auto`}>
              {events.map((event) => (
                <div key={event.id} className={`p-3 ${hoverBgColor}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${event.type === 'meeting' 
                        ? isDark ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-500'
                        : event.type === 'event' 
                          ? isDark ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                          : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      <Calendar size={16} />
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
              <button className={`text-sm ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium`}>View full calendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;