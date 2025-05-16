import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const unsub = window.electron.getMatchSeconds((seconds) =>
      console.log(seconds)
    );
    return unsub;
  }, []);

  return <></>;
}

export default App;
