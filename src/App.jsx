import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/NavBar/navbar.jsx";
import Home from "./components/Home/home.jsx";
import AddTrade2 from "./Pages/Trades/AddTrade2.jsx";
import axios from "axios";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  let data1="";
  useEffect(() => {
    const getAccounts = async () => {
      try {
        const response = await axios.post(
          "https://2s33943isc.execute-api.eu-north-1.amazonaws.com/development/addtrade",
          {
            type: "get_accounts",
            body: { email: "zhouvel7@gmail.com" },
          }
        );
        console.log(response.data);
        setAccounts(response.data.accounts);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    getAccounts();
  }, []); // Empty dependency array to run only once on mount

  // Optional: Add a separate effect to log when accounts change
  useEffect(() => {
    if (!loading) {
      console.log("Accounts fetched successfully:", accounts);
    }
  }, [accounts, loading]);
  
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/trades"
          element={
            loading ? (
              <div className="p-4 text-center">Loading accounts...</div>
            ) : (
              <AddTrade2 data={accounts} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;