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
  removeTeamFromCurrentMatch,
  getImageAsBase64,
  updateMatch,
  getCurrentMatch,
  saveConfigToCurrentMatch,
  updateTeamAScore,
  updateTeamBScore,
} from "../services/dataService.js";
import {
  startMatchTime,
  stopMatchTime,
  isMatchTimeRunning,
  updateMatchTime,
  startWarmupTime,
  stopWarmupTime,
  isWarmupTimeRunning,
} from "../services/timeService.js";
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

  ipcMainOn("saveConfig", (config) => {
    saveConfigToCurrentMatch(config, mainWindow, scoreboardWindow);
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

  ipcMainOn("updateMatch", () => {
    const currentMatch = getCurrentMatch();
    if (currentMatch) {
      updateMatch(currentMatch);
    } else {
      console.error("No current match to update");
    }
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

  ipcMainOn("removeTeamA", () => {
    removeTeamFromCurrentMatch(true, mainWindow, scoreboardWindow);
  });

  ipcMainOn("removeTeamB", () => {
    removeTeamFromCurrentMatch(false, mainWindow, scoreboardWindow);
  });

  ipcMainOn("deleteTeam", (teamName) => {
    deleteTeamByName(teamName);
  });

  ipcMainHandle("getImageAsBase64", (imagePath) => {
    return getImageAsBase64(imagePath);
  });

  // ---------- ---------- TIME ---------- ---------- //
  ipcMainOn("startMatchTime", () => {
    startMatchTime(mainWindow, scoreboardWindow);
  });

  ipcMainOn("stopMatchTime", () => {
    stopMatchTime();
  });

  ipcMainHandle("isMatchTimeRunning", () => {
    return isMatchTimeRunning();
  });

  ipcMainOn("startWarmupTime", () => {
    startWarmupTime(mainWindow, scoreboardWindow);
  });

  ipcMainOn("stopWarmupTime", () => {
    stopWarmupTime();
  });

  ipcMainHandle("isWarmupTimeRunning", () => {
    return isWarmupTimeRunning();
  });

  ipcMainOn("updateMatchTime", (newTimeSec) => {
    updateMatchTime(newTimeSec, mainWindow, scoreboardWindow);
  });

  // ---------- ---------- SCORE ---------- ---------- //
  ipcMainOn("updateTeamAScore", (score) => {
    updateTeamAScore(score, mainWindow, scoreboardWindow);
  });

  ipcMainOn("updateTeamBScore", (score) => {
    updateTeamBScore(score, mainWindow, scoreboardWindow);
  });
}
