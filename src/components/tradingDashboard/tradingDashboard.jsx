import React from "react";

function TradingDashboard() {
  // Sample data for the dashboard
  const portfolioData = {
    currentBalance: 59789.45,
    changePercent: 2.67,
    changeAmount: 1621.29,
    topGainers: [
      { asset: "Ethereum", gains: "+12.7", price: 847.45 },
      { asset: "Bitcoin", gains: "+21.3", price: 74.12 },
      { asset: "Ethereum", gains: "+17.3", price: 2315.00 },
      { asset: "Polka Dot", gains: "+08.6", price: 26.35 },
      { asset: "Via Coin", gains: "+31.5", price: 45.32 }
    ],
    tradeVolume: 35459.45,
    volumeIncrease: 1.3,
    totalProfit: 28274.97,
    profitIncrease: 1.7,
    totalLoss: 8274.97,
    lossIncrease: 1.1,
    recentActivity: [
      { type: "Exchange", asset: "Bitcoin", date: "28/04/2024", amount: 15458.00, marketCap: "19.124B" },
      { type: "Exchange", asset: "Polka Dot", date: "24/03/2024", amount: 28147.00, marketCap: "14.321M" },
      { type: "Exchange", asset: "Solana", date: "17/03/2024", amount: 32124.00, marketCap: "21.214B" }
    ],
    cryptoAssets: [
      { asset: "Ethereum", price: 847.45, holding: "1.28TC", change: "+12.7" },
      { asset: "Bitcoin", price: 26.31, holding: "1.8USD", change: "+21.1" },
      { asset: "Polka dot", price: 71.28, holding: "2.78TC", change: "+32.2" },
      { asset: "Solana", price: 18.61, holding: "1.18TC", change: "+29.5" }
    ]
  };
  
  const user = {
    name: "Jacob Allinson",
    email: "jaxobinson14@gmail.com"
  };

  return (
    <div className="dashboard-container">
      <aside className="side-menu">
        <div className="logo-container">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <span className="logo-text">tobase</span>
        </div>
        
        <div className="menu-section">
          <h3>Menu</h3>
          <ul>
            <li className="menu-item active">
              <i className="icon dashboard-icon"></i>
              <span>Dashboard</span>
            </li>
            <li className="menu-item active">
              <i className="icon portfolio-icon"></i>
              <span>Portfolio</span>
            </li>
            <li className="menu-item">
              <i className="icon market-icon"></i>
              <span>Market</span>
            </li>
            <li className="menu-item">
              <i className="icon charts-icon"></i>
              <span>Chart & Trends</span>
            </li>
            <li className="menu-item">
              <i className="icon statistics-icon"></i>
              <span>Statistics</span>
            </li>
            <li className="menu-item">
              <i className="icon assets-icon"></i>
              <span>Assets</span>
            </li>
          </ul>
        </div>
        
        <div className="others-section">
          <h3>Others</h3>
          <ul>
            <li className="menu-item">
              <i className="icon settings-icon"></i>
              <span>Settings</span>
            </li>
            <li className="menu-item">
              <i className="icon help-icon"></i>
              <span>Help</span>
            </li>
          </ul>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">
            <img src="/avatar.jpg" alt="User" />
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <h1 className="page-title">Portfolio</h1>
        
        {/* Top div - Balance and Top Gainers */}
        <div className="dashboard-row top-row">
          <div className="chart-card balance-chart">
            <div className="chart-header">
              <h3>Current Balance</h3>
              <div className="time-filters">
                <button className="time-filter">1D</button>
                <button className="time-filter">2W</button>
                <button className="time-filter active">1M</button>
                <button className="time-filter">3M</button>
                <button className="time-filter">6M</button>
                <button className="time-filter">1Y</button>
              </div>
            </div>
            <div className="balance-info">
              <h2>${portfolioData.currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <span className="change positive">+${portfolioData.changeAmount}</span>
            </div>
            <div className="chart-area">
              {/* This would be your actual chart component */}
              <div className="placeholder-chart"></div>
            </div>
          </div>
          
          <div className="chart-card top-gainers">
            <div className="chart-header">
              <h3>Top Gainers</h3>
              <button className="more-options">...</button>
            </div>
            <table className="gainers-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Gains</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.topGainers.map((gainer, index) => (
                  <tr key={index}>
                    <td>
                      <div className="asset-info">
                        <div className={`asset-icon ${gainer.asset.toLowerCase()}`}></div>
                        <span>{gainer.asset}</span>
                      </div>
                    </td>
                    <td className="gains">{gainer.gains}</td>
                    <td className="price">${gainer.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Middle div - Trade metrics */}
        <div className="dashboard-row middle-row">
          <div className="metric-card">
            <div className="metric-icon trade-volume-icon"></div>
            <div className="metric-content">
              <h4>Trading Volume</h4>
              <h3>${portfolioData.tradeVolume.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
              <span className="change positive">{portfolioData.volumeIncrease} increased</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon total-profit-icon"></div>
            <div className="metric-content">
              <h4>Total Profit</h4>
              <h3>${portfolioData.totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
              <span className="change positive">{portfolioData.profitIncrease} increased</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon total-loss-icon"></div>
            <div className="metric-content">
              <h4>Total Loss</h4>
              <h3>${portfolioData.totalLoss.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
              <span className="change negative">{portfolioData.lossIncrease} increased</span>
            </div>
          </div>
          
          <div className="metric-card portfolio-summary">
            <div className="summary-header">
              <h3>Portfolio Value</h3>
              <span className="portfolio-change positive">+{portfolioData.changePercent}%</span>
            </div>
            <h2>${portfolioData.currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
            <button className="acquire-assets-btn">Acquire more Assets</button>
          </div>
        </div>
        
        {/* Bottom div - Recent Activity and Assets */}
        <div className="dashboard-row bottom-row">
          <div className="chart-card recent-activity">
            <div className="chart-header">
              <h3>Recent Activity</h3>
              <div className="activity-controls">
                <button className="filter-btn">Filter</button>
                <button className="view-all-btn">View all</button>
              </div>
            </div>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Asset</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.type}</td>
                    <td>
                      <div className="asset-info">
                        <div className={`asset-icon ${activity.asset.toLowerCase()}`}></div>
                        <span>{activity.asset}</span>
                      </div>
                    </td>
                    <td>{activity.date}</td>
                    <td>${activity.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{activity.marketCap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="chart-card crypto-assets">
            <div className="chart-header">
              <h3>Your Crypto Assets</h3>
              <button className="more-options">...</button>
            </div>
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Price</th>
                  <th>Holding</th>
                  <th>24h%</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.cryptoAssets.map((asset, index) => (
                  <tr key={index}>
                    <td>
                      <div className="asset-info">
                        <div className={`asset-icon ${asset.asset.toLowerCase()}`}></div>
                        <span>{asset.asset}</span>
                      </div>
                    </td>
                    <td>${asset.price}</td>
                    <td>{asset.holding}</td>
                    <td className="change positive">{asset.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TradingDashboard;