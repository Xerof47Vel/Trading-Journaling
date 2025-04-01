import Header from "./Header";
import Body from "./Body";
import Navigation from "./Navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTrade from "./AddTrade";

function App() {
  return (
    <Router>
      <Navigation />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Body />} />
          <Route exact path="/addtrade" element={<AddTrade/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
