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