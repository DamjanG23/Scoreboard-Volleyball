import {app, BrowserWindow} from 'electron';
import path from 'path';
import { ipcMainHandle, isDev } from './utils/util.js';
import { getPreloadPath } from './utils/pathResolver.js';
import { getConfig, getMatchSeconds, getScoreboardState } from './services/stateService.js';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({

        webPreferences: {
            preload: getPreloadPath(),
        }

    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }



    ipcMainHandle("getScoreboardState", () => {
        return getScoreboardState();
    })

    ipcMainHandle("getConfig", () => {
        return getConfig();
    })


    getMatchSeconds(mainWindow);
});