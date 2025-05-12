import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import { isDev } from './utils/util.js';
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



    ipcMain.handle("scoreboardState", () => {
        return getScoreboardState();
    })

    ipcMain.handle("config", () => {
        return getConfig();
    })


    getMatchSeconds(mainWindow);
});