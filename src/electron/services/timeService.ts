import { BrowserWindow } from "electron";
import { getCurrentMatch, saveCurrentMatch } from "./dataService.js";

let timeInterval: NodeJS.Timeout | null = null;
let warmupInterval: NodeJS.Timeout | null = null;
let timeoutInterval: NodeJS.Timeout | null = null;
let timeoutTimeSec: number = 0;
let restInterval: NodeJS.Timeout | null = null;
let restTimeSec: number = 0;

export function startMatchTime(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  // Don't start if already running or warmup is running
  if (timeInterval || warmupInterval) {
    console.log("Match time or warmup is already running");
    return false;
  }

  const currentMatch = getCurrentMatch();
  if (!currentMatch) {
    console.error("No current match found to start time");
    return false;
  }

  // Initialize timeSec if it doesn't exist
  if (currentMatch.timeSec === undefined) {
    currentMatch.timeSec = 0;
  }

  console.log("Starting match time from:", currentMatch.timeSec);

  // Increment time every second
  timeInterval = setInterval(() => {
    const match = getCurrentMatch();
    if (match) {
      match.timeSec = (match.timeSec || 0) + 1;
      saveCurrentMatch(match, mainWindow, scoreboardWindow);
    }
  }, 1000);

  return true;
}

export function stopMatchTime(): boolean {
  if (!timeInterval) {
    console.log("Match time is not running");
    return false;
  }

  clearInterval(timeInterval);
  timeInterval = null;
  console.log("Match time stopped");
  return true;
}

export function isMatchTimeRunning(): boolean {
  return timeInterval !== null;
}

export function startWarmupTime(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  // Don't start if already running or match time is running
  if (warmupInterval || timeInterval) {
    console.log("Warmup or match time is already running");
    return false;
  }

  const currentMatch = getCurrentMatch();
  if (!currentMatch) {
    console.error("No current match found to start warmup");
    return false;
  }

  // Initialize timeSec if it doesn't exist
  if (currentMatch.timeSec === undefined) {
    currentMatch.timeSec = 0;
  }

  console.log("Starting warmup countdown from:", currentMatch.timeSec);

  // Decrement time every second
  warmupInterval = setInterval(() => {
    const match = getCurrentMatch();
    if (match) {
      // Don't go below 0
      if ((match.timeSec || 0) > 0) {
        match.timeSec = (match.timeSec || 0) - 1;
        saveCurrentMatch(match, mainWindow, scoreboardWindow);
      } else {
        // Stop warmup when reaching 0
        stopWarmupTime();
      }
    }
  }, 1000);

  return true;
}

export function stopWarmupTime(): boolean {
  if (!warmupInterval) {
    console.log("Warmup time is not running");
    return false;
  }

  clearInterval(warmupInterval);
  warmupInterval = null;
  console.log("Warmup time stopped");
  return true;
}

export function isWarmupTimeRunning(): boolean {
  return warmupInterval !== null;
}

export function updateMatchTime(
  newTimeSec: number,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  const currentMatch = getCurrentMatch();
  if (!currentMatch) {
    console.error("No current match found to update time");
    return false;
  }

  currentMatch.timeSec = newTimeSec;
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
  console.log("Match time updated to:", newTimeSec);
  return true;
}

export function startTimeout(
  durationSec: number,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  if (timeoutInterval) {
    console.log("Timeout is already running");
    return false;
  }

  timeoutTimeSec = durationSec;
  console.log("Starting timeout countdown from:", timeoutTimeSec);

  // Send initial timeout state
  mainWindow.webContents.send("onTimeoutUpdate", timeoutTimeSec);
  if (scoreboardWindow) {
    scoreboardWindow.webContents.send("onTimeoutUpdate", timeoutTimeSec);
  }

  // Decrement timeout time every second
  timeoutInterval = setInterval(() => {
    if (timeoutTimeSec > 0) {
      timeoutTimeSec--;
      mainWindow.webContents.send("onTimeoutUpdate", timeoutTimeSec);
      if (scoreboardWindow) {
        scoreboardWindow.webContents.send("onTimeoutUpdate", timeoutTimeSec);
      }
    } else {
      // Stop timeout when reaching 0
      stopTimeout(mainWindow, scoreboardWindow);
    }
  }, 1000);

  return true;
}

export function stopTimeout(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  if (!timeoutInterval) {
    console.log("Timeout is not running");
    return false;
  }

  clearInterval(timeoutInterval);
  timeoutInterval = null;
  timeoutTimeSec = 0;
  console.log("Timeout stopped");

  // Send timeout ended event
  mainWindow.webContents.send("onTimeoutEnded");
  if (scoreboardWindow) {
    scoreboardWindow.webContents.send("onTimeoutEnded");
  }

  return true;
}

export function isTimeoutRunning(): boolean {
  return timeoutInterval !== null;
}

export function getTimeoutTimeSec(): number {
  return timeoutTimeSec;
}

export function startRest(
  durationSec: number,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  if (restInterval) {
    console.log("Rest period is already running");
    return false;
  }

  restTimeSec = durationSec;
  console.log("Starting rest period countdown from:", restTimeSec);

  // Send initial rest state
  mainWindow.webContents.send("onRestUpdate", restTimeSec);
  if (scoreboardWindow) {
    scoreboardWindow.webContents.send("onRestUpdate", restTimeSec);
  }

  // Decrement rest time every second
  restInterval = setInterval(() => {
    if (restTimeSec > 0) {
      restTimeSec--;
      mainWindow.webContents.send("onRestUpdate", restTimeSec);
      if (scoreboardWindow) {
        scoreboardWindow.webContents.send("onRestUpdate", restTimeSec);
      }
    } else {
      // Stop rest when reaching 0
      stopRest(mainWindow, scoreboardWindow);
    }
  }, 1000);

  return true;
}

export function stopRest(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  if (!restInterval) {
    console.log("Rest period is not running");
    return false;
  }

  clearInterval(restInterval);
  restInterval = null;
  restTimeSec = 0;
  console.log("Rest period stopped");

  // Send rest ended event
  mainWindow.webContents.send("onRestEnded");
  if (scoreboardWindow) {
    scoreboardWindow.webContents.send("onRestEnded");
  }

  return true;
}

export function isRestRunning(): boolean {
  return restInterval !== null;
}

export function getRestTimeSec(): number {
  return restTimeSec;
}

// Clean up interval when app closes
export function cleanupTimeService(): void {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
  if (warmupInterval) {
    clearInterval(warmupInterval);
    warmupInterval = null;
  }
  if (timeoutInterval) {
    clearInterval(timeoutInterval);
    timeoutInterval = null;
  }
  if (restInterval) {
    clearInterval(restInterval);
    restInterval = null;
  }
}
