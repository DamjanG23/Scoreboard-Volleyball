import { getConfig, getScoreboardState } from "../services/stateService.js";
import { ipcMainHandle } from "../utils/util.js";

export function setupDataHandelers() {
  ipcMainHandle("getScoreboardState", () => {
    return getScoreboardState();
  });

  ipcMainHandle("getConfig", () => {
    return getConfig();
  });
}
