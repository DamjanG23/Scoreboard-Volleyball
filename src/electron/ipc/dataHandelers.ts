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
  saveTeam,
  getTeams,
  deleteTeamByName,
  loadCurrentTeam,
} from "../services/dataService.js";
import { ipcMainHandle, ipcMainOn } from "../utils/util.js";

export function setupDataHandelers(
  mainWindow: BrowserWindow,
  scoreboardWindow: BrowserWindow
) {
  ipcMainHandle("getScoreboardState", () => {
    return getScoreboardState();
  });

  ipcMainHandle("getConfig", () => {
    return getConfig();
  });

  // ---------- ---------- MATCHES ---------- ---------- //

  ipcMainHandle("getMatches", () => {
    return getMatches();
  });

  ipcMainOn("createNewMatch", (matchName) => {
    const newMatch = createNewMatch(matchName);
    saveCurrentMatch(newMatch, mainWindow, scoreboardWindow);
  });

  ipcMainHandle("removeCurrentMatch", () => {
    return removeCurrentMatch(mainWindow, scoreboardWindow);
  });

  ipcMainOn("loadMatch", (id) => {
    const loadedMatch = getMatchById(id);
    console.log("Match loaded from local storage: ", loadedMatch);
    saveCurrentMatch(loadedMatch, mainWindow, scoreboardWindow);
  });

  ipcMainOn("deleteMatch", (id) => {
    deleteMatchById(id);
  });

  // ---------- ---------- TEAMS ---------- ---------- //
  ipcMainHandle("getTeams", () => {
    return getTeams();
  });

  ipcMainOn("saveTeam", (team) => {
    saveTeam(team);
  });

  ipcMainOn("saveTeamA", (team) => {
    saveTeam(team);
    loadCurrentTeam(team, true, mainWindow, scoreboardWindow);
  });

  ipcMainOn("saveTeamB", (team) => {
    saveTeam(team);
    loadCurrentTeam(team, false, mainWindow, scoreboardWindow);
  });

  ipcMainOn("deleteTeam", (teamName) => {
    deleteTeamByName(teamName);
  });
}
