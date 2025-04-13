
// import Header from "./Header";
// import Body from "./Body";
 import Navigation from "./components/NavBar/navbar.jsx";
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AddTrade from "./AddTrade";
import Home from "./components/Home/home.jsx";

import AddTrade2 from "./Pages/Trades/AddTrade2.jsx"
function App() {
  return (
    <Router>
      <Navigation />
      {/* <Header /> */}
      {/* <Body /> */}
      {/* <AddTrade /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trades" element={<AddTrade2 />} />
 
        </Routes>
    </Router>

  );
}

export default App;
