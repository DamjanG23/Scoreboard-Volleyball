const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {

    test: () => console.log('Testing preload!'),

} satisfies Window['electron']);