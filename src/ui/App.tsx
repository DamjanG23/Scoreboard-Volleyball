import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import MainView from "./MainView"
import ScoreboardView from "./ScoreboardView";

function App() {
  useEffect(() => {
    const unsub = window.electron.getMatchSeconds((seconds) => 
      console.log(seconds)
    );
    return unsub;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/scoreboard" element={<ScoreboardView />} />
      </Routes>
    </Router>
  );
}

export default App;