import { BrowserWindow } from "electron";

const POOLING_INTERVAL = 1000;

export function getMatchSeconds(window: BrowserWindow) {
    let matchSeconds = 0;

    setInterval(async () => {
        matchSeconds++;
        window.webContents.send("matchSeconds", matchSeconds)
    }, POOLING_INTERVAL)
};

export function getScoreboardState() {
    const scoreboardState = "scoreboardState 123";
    return scoreboardState;
};

export function getConfig() {
    const config = "match config 123";
    return config;
};