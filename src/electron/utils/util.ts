import { ipcMain, WebContents } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMaping>(
  key: Key,
  handler: (
    payload?: any
  ) => EventPayloadMaping[Key] | Promise<EventPayloadMaping[Key]>
) {
  ipcMain.handle(key, (_event, payload) => handler(payload));
}

export function ipcMainOn<Key extends keyof EventPayloadMaping>(
  key: Key,
  handler: (payload: EventPayloadMaping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => handler(payload));
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMaping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMaping[Key]
) {
  if (!webContents.isDestroyed()) {
    webContents.send(key, payload);
  }
}
