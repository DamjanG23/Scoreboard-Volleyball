import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "../utils/util.js";

const POOLING_INTERVAL = 1000;

export function getMatchSeconds(window: BrowserWindow) {
  let seconds = 0;

  setInterval(async () => {
    seconds++;
    ipcWebContentsSend("getMatchSeconds", window.webContents, { seconds });
  }, POOLING_INTERVAL);
}

export function getScoreboardState() {
  const scoreboardState: string = "scoreboardState 123";
  const teamAName: string = "Rabotnicki";
  const teamBName: string = "Strumica";
  return { scoreboardState, teamAName, teamBName };
}

export function getConfig() {
  const config = "match config 123";
  return { config };
}
