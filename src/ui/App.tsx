import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import MainView from "./MainView";
import ScoreboardView from "./ScoreboardView";
import { useEffect, useState } from "react";

function App() {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useEffect(() => {
    const unsubscribe = window.electron.onCurrentMatchSaved((currentMatch) => {
      console.log("Current Match recieved from back end: ", currentMatch);
      setCurrentMatch(currentMatch);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.onCurrentMatchRemoved(() => {
      setCurrentMatch(null);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainView currentMatch={currentMatch} />} />
        <Route
          path="/scoreboard"
          element={<ScoreboardView currentMatch={currentMatch} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
