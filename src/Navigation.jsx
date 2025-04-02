import React from "react";
import { Link } from "react-router-dom";
function Navigation() {
  document.title = "The Journal";
  return (
    <div className="pageContainer">
      {" "}
      <nav>
        <h1 className="websiteHeaderName">The Journal</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/addtrade">Trade Log</Link>
          </li>
          <li>
            <Link to="/dashboard">DashBoard</Link>
          </li>
          <li>
            <Link to="#">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
