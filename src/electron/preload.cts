const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {

    test: () => console.log('Testing preload!'),

    getMatchSeconds: (callback) => {
        ipcOn("getMatchSeconds", (seconds) => {
            callback(seconds);
        });
    },

    getScoreboardState: () => {
        return ipcInvoke("getScoreboardState")
    },

    getConfig: () => {
        return ipcInvoke("getConfig")
    },

} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMaping>(key: Key): Promise<EventPayloadMaping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMaping>(
    key: Key,
    callback: (payload: EventPayloadMaping[Key]) => void
) {
    return electron.ipcRenderer.on(key, (_: any, payload: EventPayloadMaping[Key]) => callback(payload));
}