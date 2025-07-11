import { BrowserWindow } from "electron";
import {
  createNewMatch,
  deleteMatchById,
  getConfig,
  getMatchById,
  getMatches,
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

  ipcMainHandle("getMatches", () => {
    return getMatches();
  });

  ipcMainOn("createNewMatch", (matchName) => {
    const newMatch = createNewMatch(matchName);
    saveCurrentMatch(newMatch, mainWindow);
  });

  ipcMainHandle("removeCurrentMatch", () => {
    return removeCurrentMatch(mainWindow);
  });

  ipcMainOn("loadMatch", (id) => {
    const loadedMatch = getMatchById(id);
    saveCurrentMatch(loadedMatch, mainWindow);
  });

  ipcMainOn("deleteMatch", (id) => {
    deleteMatchById(id);
  });
}
