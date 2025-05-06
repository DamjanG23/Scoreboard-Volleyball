type TestType = {
    test: number;
  };

  interface Window {
    electron: {
        test: () => void;
    }
  }