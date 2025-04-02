import Header from "./Header";
import Body from "./Body";
import Navigation from "./Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTrade from "./AddTrade";
import Dashboard from "./DashBoard";
import AddTradingAccount from "./AddTradingAccount";

function App() {
  return (
    <Router>
      <Navigation />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Body />} />
          <Route exact path="/addtrade" element={<AddTrade/>}></Route>
          <Route exact path="/dashboard" element={<Dashboard/>}></Route>
          <Route exact path="/tradingAccount" element={<AddTradingAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
