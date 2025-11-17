const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  // ---------- ---------- SCORE & MATCH DATA ---------- ---------- //

  getMatchSeconds: (callback) =>
    ipcOn("getMatchSeconds", (seconds) => {
      callback(seconds);
    }),

  getScoreboardState: () => {
    return ipcInvoke("getScoreboardState");
  },

  getConfig: () => {
    return ipcInvoke("getConfig");
  },

  saveConfig: (config) => {
    ipcSend("saveConfig", config);
  },

  createNewMatch: (matchName) => {
    ipcSend("createNewMatch", matchName);
  },

  onCurrentMatchSaved: (callback) =>
    ipcOn("onCurrentMatchSaved", (currentMatch) => {
      callback(currentMatch);
    }),

  removeCurrentMatch: () => {
    return ipcInvoke("removeCurrentMatch");
  },

  onCurrentMatchRemoved: (callback) =>
    ipcOn("onCurrentMatchRemoved", (isCurrentMatchRemoved) => {
      callback(isCurrentMatchRemoved);
    }),

  getMatches: () => {
    return ipcInvoke("getMatches");
  },

  loadMatch: (id) => {
    ipcSend("loadMatch", id);
  },

  deleteMatch: (id) => {
    ipcSend("deleteMatch", id);
  },

  updateMatch: () => {
    ipcSend("updateMatch", undefined);
  },

  // ---------- ---------- TEAM ---------- ---------- //

  getTeams: () => {
    return ipcInvoke("getTeams");
  },

  saveTeam: (team) => {
    ipcSend("saveTeam", team);
  },

  saveTeamA: (team) => {
    ipcSend("saveTeamA", team);
  },

  saveTeamB: (team) => {
    ipcSend("saveTeamB", team);
  },

  removeTeamA: () => {
    ipcSend("removeTeamA", undefined);
  },

  removeTeamB: () => {
    ipcSend("removeTeamB", undefined);
  },

  deleteTeam: (teamName) => {
    ipcSend("deleteTeam", teamName);
  },

  getImageAsBase64: (imagePath) => {
    return ipcInvoke("getImageAsBase64", imagePath);
  },

  // ---------- ---------- TIME ---------- ---------- //

  startMatchTime: () => {
    ipcSend("startMatchTime", undefined);
  },

  stopMatchTime: () => {
    ipcSend("stopMatchTime", undefined);
  },

  isMatchTimeRunning: () => {
    return ipcInvoke("isMatchTimeRunning");
  },

  startWarmupTime: () => {
    ipcSend("startWarmupTime", undefined);
  },

  stopWarmupTime: () => {
    ipcSend("stopWarmupTime", undefined);
  },

  isWarmupTimeRunning: () => {
    return ipcInvoke("isWarmupTimeRunning");
  },

  updateMatchTime: (newTimeSec) => {
    ipcSend("updateMatchTime", newTimeSec);
  },

  // ---------- ---------- SCORE ---------- ---------- //

  updateTeamAScore: (score) => {
    ipcSend("updateTeamAScore", score);
  },

  updateTeamBScore: (score) => {
    ipcSend("updateTeamBScore", score);
  },

  incrementTeamASets: () => {
    ipcSend("incrementTeamASets", undefined);
  },

  decrementTeamASets: () => {
    ipcSend("decrementTeamASets", undefined);
  },

  incrementTeamBSets: () => {
    ipcSend("incrementTeamBSets", undefined);
  },

  decrementTeamBSets: () => {
    ipcSend("decrementTeamBSets", undefined);
  },

  // ---------- ---------- TIMEOUTS ---------- ---------- //

  incrementTeamATimeouts: () => {
    ipcSend("incrementTeamATimeouts", undefined);
  },

  decrementTeamATimeouts: () => {
    ipcSend("decrementTeamATimeouts", undefined);
  },

  incrementTeamBTimeouts: () => {
    ipcSend("incrementTeamBTimeouts", undefined);
  },

  decrementTeamBTimeouts: () => {
    ipcSend("decrementTeamBTimeouts", undefined);
  },

  // ---------- ---------- SCOREBOARD WINDOW MANAGEMENT ---------- ---------- //

  getIsScoreboardOpen: () => {
    return ipcInvoke("getIsScoreboardOpen");
  },

  onScoreboardWindowClosed: (callback) =>
    ipcOn("onScoreboardWindowClosed", (isClosed) => {
      callback(isClosed);
    }),

  showScoreboardWindow: () => {
    return ipcInvoke("showScoreboardWindow");
  },

  closeScoreboardWindow: () => {
    return ipcInvoke("closeScoreboardWindow");
  },

  onScoreboardWindowOpened: (callback) =>
    ipcOn("onScoreboardWindowOpened", (isOpened) => {
      callback(isOpened);
    }),

  toggleScoreboardFullscreen: () => {
    return ipcInvoke("toggleScoreboardFullscreen");
  },

  onScoreboardFullscreenChange: (callback) =>
    ipcOn("onScoreboardFullscreenChange", (isFullscreen) => {
      callback(isFullscreen);
    }),

  // ---------- ---------- MAIN WINDOW MANAGEMENT ---------- ---------- //

  toggleMainFullscreen: () => {
    return ipcInvoke("toggleMainFullscreen");
  },

  onMainFullscreenChange: (callback) =>
    ipcOn("onMainFullscreenChange", (isFullscreen) => {
      callback(isFullscreen);
    }),

  selectLogoFile: () => {
    return ipcInvoke("selectLogoFile");
  },
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMaping>(
  key: Key,
  payload?: any
): Promise<EventPayloadMaping[Key]> {
  return electron.ipcRenderer.invoke(key, payload);
}

function ipcOn<Key extends keyof EventPayloadMaping>(
  key: Key,
  callback: (payload: EventPayloadMaping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMaping>(
  key: Key,
  payload: EventPayloadMaping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
