import { BrowserWindow } from "electron";
import {
  createNewMatch,
  getConfig,
  getScoreboardState,
  removeCurrentMatch,
  saveCurrentMatch,
} from "../services/dataService.js";
import { ipcMainHandle, ipcMainOn } from "../utils/util.js";

export function setupDataHandelers(mainWindow: BrowserWindow) {
  ipcMainHandle("getScoreboardState", () => {
    return getScoreboardState();
  });

  ipcMainHandle("getConfig", () => {
    return getConfig();
  });

  ipcMainOn("createNewMatch", (matchName) => {
    const newMatch = createNewMatch(matchName);
    saveCurrentMatch(newMatch, mainWindow);
  });

  ipcMainHandle("removeCurrentMatch", () => {
    return removeCurrentMatch(mainWindow);
  });
}
