import { BrowserWindow } from "electron";
import {
  closeScoreboardWindow,
  getIsScoreboardOpen,
  showScoreboardWindow,
  toggleMainFullscreen,
  toggleScoreboardFullscreen,
  openLogoFileDialog,
  getScoreboardFillState,
  toggleScoreboardFill,
} from "../services/windowService.js";
import { ipcMainHandle, ipcWebContentsSend } from "../utils/util.js";

export function setupWindowHandlers(
  mainWindow: BrowserWindow,
  scoreboardWindow: BrowserWindow
) {
  ipcMainHandle("getIsScoreboardOpen", () => {
    return getIsScoreboardOpen(scoreboardWindow);
  });

  ipcMainHandle("showScoreboardWindow", () => {
    return showScoreboardWindow(scoreboardWindow);
  });

  ipcMainHandle("closeScoreboardWindow", () => {
    return closeScoreboardWindow(scoreboardWindow);
  });

  ipcMainHandle("toggleScoreboardFullscreen", () => {
    return toggleScoreboardFullscreen(scoreboardWindow);
  });

  ipcMainHandle("toggleMainFullscreen", () => {
    return toggleMainFullscreen(mainWindow);
  });

  ipcMainHandle("selectLogoFile", async () => {
    return await openLogoFileDialog(mainWindow);
  });

  ipcMainHandle("getScoreboardFillState", () => {
    return getScoreboardFillState();
  });

  ipcMainHandle("toggleScoreboardFill", () => {
    const newState = toggleScoreboardFill();
    // Notify both windows of the state change
    ipcWebContentsSend(
      "onScoreboardFillStateChange",
      mainWindow.webContents,
      newState
    );
    ipcWebContentsSend(
      "onScoreboardFillStateChange",
      scoreboardWindow.webContents,
      newState
    );
    return newState;
  });
}
