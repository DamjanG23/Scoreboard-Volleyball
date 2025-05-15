import { app} from "electron";
import { ipcMainHandle} from "./utils/util.js";
import {
  getConfig,
  getMatchSeconds,
  getScoreboardState,
} from "./services/stateService.js";
import { initiateMainWindow } from "./windows/mainWindow.js";
import { initiateScoreboardWindow } from "./windows/scoreboardWindow.js";

app.on("ready", () => {
  const mainWindow = initiateMainWindow();
  const scoreboardWindow = initiateScoreboardWindow();


  ipcMainHandle("getScoreboardState", () => {
    return getScoreboardState();
  });

  ipcMainHandle("getConfig", () => {
    return getConfig();
  });

  getMatchSeconds(mainWindow);
  getMatchSeconds(scoreboardWindow);
});
