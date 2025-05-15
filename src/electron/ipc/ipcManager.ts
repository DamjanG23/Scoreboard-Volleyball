import { setupDataHandelers } from "./dataHandelers.js";
import { setupWindowHandlers } from "./windowHandlers.js";

export function setupIPC() {
  setupWindowHandlers();
  setupDataHandelers();
}
