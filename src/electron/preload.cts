const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {

    test: () => console.log('Testing preload!'),

    getMatchSeconds: (callback: (matchSeconds: any) => void) => {
        electron.ipcRenderer.on("matchSeconds", (_: any, seconds: any) => {
            callback(seconds);
        });
    },

    getScoreboardState: () => {
        return electron.ipcRenderer.invoke("scoreboardState")
    },

    getConfig: () => {
        return electron.ipcRenderer.invoke("config")
    },

} /* satisfies Window['electron'] */);