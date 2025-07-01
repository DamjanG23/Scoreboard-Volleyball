import { BrowserWindow } from "electron";
import { setupDataHandelers } from "./dataHandelers.js";
import { setupWindowHandlers } from "./windowHandlers.js";

export function setupIPC(scoreboardWindow: BrowserWindow) {
  setupWindowHandlers(scoreboardWindow);
  setupDataHandelers();
}
