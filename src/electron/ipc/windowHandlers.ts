import { BrowserWindow } from "electron";
import {
  closeScoreboardWindow,
  getIsScoreboardOpen,
  showScoreboardWindow,
} from "../services/windowService.js";
import { ipcMainHandle } from "../utils/util.js";

export function setupWindowHandlers(scoreboardWindow: BrowserWindow) {
  ipcMainHandle("getIsScoreboardOpen", () => {
    return getIsScoreboardOpen(scoreboardWindow);
  });

  ipcMainHandle("showScoreboardWindow", () => {
    return showScoreboardWindow(scoreboardWindow);
  });

  ipcMainHandle("closeScoreboardWindow", () => {
    return closeScoreboardWindow(scoreboardWindow);
  });
}
