import { getIsScoreboardOpen } from "../services/windowService.js";
import { ipcMainHandle } from "../utils/util.js";

export function setupWindowHandlers() {
  ipcMainHandle("getIsScoreboardOpen", () => {
    return getIsScoreboardOpen();
  });
}
