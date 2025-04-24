import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/NavBar/navbar.jsx";
import Home from "./components/Home/home.jsx";
import AddTrade2 from "./Pages/Trades/AddTrade2.jsx";
import Login from "./Pages/Login/Login.jsx";
import axios from "axios";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);


  const showNav = location.pathname !== "/";

  return (
    <>
      {showNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/trades"
          element={
            loading ? (
              <div className="p-4 text-center">Loading accounts...</div>
            ) : (
              <AddTrade2 />
            )
          }
        />
      </Routes>
    </>
  );
}

export default AppWrapper;
