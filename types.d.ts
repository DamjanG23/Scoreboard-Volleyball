type TestType = {
    test: number;
  };

  interface Window {
    electron: {
        test: () => void;
        //getMatchSeconds: () => void;
        getScoreboardState: () => void;
        getConfig: () => void;
    }
  }