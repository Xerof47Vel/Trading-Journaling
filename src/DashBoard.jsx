function Dashboard() {
    const user = { name: "John", totalProfit: 500, totalEquity: 10500 }; // example user data
    
    return (
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <nav>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/my-trades">My Trades</a></li>
              <li><a href="/settings">Settings</a></li>
              <li><a href="/logout">Logout</a></li>
            </ul>
          </nav>
        </div>
  
        {/* Main content */}
        <div className="main-content">
          {/* Hero Section */}
          <section className="hero">
            <h1>Welcome, {user.name}!</h1>
            <p>Your current profit is: ${user.totalProfit}</p>
            <button>View My Trades</button>
          </section>
  
          {/* Stats Section */}
          <section className="stats">
            <div className="stat-card">
              <h3>Total Equity</h3>
              <p>${user.totalEquity}</p>
            </div>
            <div className="stat-card">
              <h3>Total Profit</h3>
              <p>${user.totalProfit}</p>
            </div>
          </section>
  
          {/* Recent Trades */}
          <section className="recent-trades">
            <h2>Recent Trades</h2>
            <table>
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Profit/Loss</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Map over recent trades */}
                <tr>
                  <td>Gold</td>
                  <td>+$50</td>
                  <td>March 30, 2025</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  