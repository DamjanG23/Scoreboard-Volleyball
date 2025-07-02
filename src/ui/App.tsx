// import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import MainView from "./MainView";
import ScoreboardView from "./ScoreboardView";
import { useState } from "react";

function App() {
  //const [isMatchLoaded, setIsMatchLoaded] = useState(false);
  const [isMatchLoaded] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView isMatchLoaded={isMatchLoaded} />} />
        <Route path="/scoreboard" element={<ScoreboardView />} />
      </Routes>
    </Router>
  );
}

export default App;
