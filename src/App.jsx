
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/NavBar/navbar.jsx";
import Home from "./components/Home/HomeBeta.jsx";
import AddTrade2 from "./Pages/Trades/AddTrade2.jsx";
import Login from "./Pages/Login/Login.jsx";
import Footer from "./components/Footer/Footer.jsx";
import TradesList from "./Pages/Trades/TradeListView.jsx";
import TradeDetails from "./Pages/Trades/TradeDetails.jsx";



function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const showNav = location.pathname !== "/";

  return (
    <>
      
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/view-trades" element={<TradesList />} />
        <Route path="view-trade/:id" element={<TradeDetails/>}/>
        <Route
          path="/trades"
          element={
         
              <AddTrade2 />
            
          }
        />
      </Routes>
  
    </>
  );
}

export default AppWrapper;
