import { BrowserWindow } from "electron";
import { getCurrentMatch, saveCurrentMatch } from "./dataService.js";

let timeInterval: NodeJS.Timeout | null = null;

export function startMatchTime(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): boolean {
  // Don't start if already running
  if (timeInterval) {
    console.log("Match time is already running");
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

// Clean up interval when app closes
export function cleanupTimeService(): void {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
}
