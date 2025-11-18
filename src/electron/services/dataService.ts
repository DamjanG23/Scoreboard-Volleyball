import { app, BrowserWindow } from "electron";
import { ipcWebContentsSend } from "../utils/util.js";
import { join, extname } from "path";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";

export function getScoreboardState() {
  const scoreboardState: string = "scoreboardState 123";
  const teamAName: string = "Rabotnicki";
  const teamBName: string = "Strumica";
  return { scoreboardState, teamAName, teamBName };
}

function sanitizeConfigForStorage(
  config?: MatchConfig
): MatchConfig | undefined {
  if (!config) {
    return undefined;
  }

  const { loadingLogoBase64, ...rest } = config;
  return {
    ...rest,
  };
}

function enrichConfigWithBase64(config?: MatchConfig): MatchConfig | undefined {
  if (!config) {
    return undefined;
  }

  const enrichedConfig: MatchConfig = { ...config };

  if (enrichedConfig.loadingLogoPath) {
    const base64 = getImageAsBase64(enrichedConfig.loadingLogoPath);
    if (base64) {
      enrichedConfig.loadingLogoBase64 = base64;
    } else {
      delete enrichedConfig.loadingLogoBase64;
    }
  } else {
    delete enrichedConfig.loadingLogoBase64;
  }

  return enrichedConfig;
}

export function getConfig() {
  const matchConfig: MatchConfig = {
    config: "string",
    timeoutDurationSec: 11,
    intervalBetweenSetsSec: 12,
    loadingLogoPath: "",
  };
  return enrichConfigWithBase64(matchConfig) ?? matchConfig;
}

export function createNewMatch(matchName: string): Match {
  const newMatch: Match = {
    id: Date.now(),
    matchName: matchName,
  };

  const dataPath = join(app.getPath("userData"), "matches.json");

  let existingMatches: Match[] = [];
  if (existsSync(dataPath)) {
    const data = readFileSync(dataPath, "utf8");
    existingMatches = JSON.parse(data);
  }

  existingMatches.push(newMatch);

  writeFileSync(dataPath, JSON.stringify(existingMatches, null, 2));

  console.log("Match saved on back end:", newMatch);
  return newMatch;
}

export function saveCurrentMatch(
  match: Match,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
) {
  const dataPath = join(app.getPath("userData"), "currentMatch.json");

  const matchForStorage: Match = {
    ...match,
    config: sanitizeConfigForStorage(match.config),
  };

  writeFileSync(dataPath, JSON.stringify(matchForStorage, null, 2));
  console.log("Current match:", matchForStorage);

  const matchForRenderer: Match = {
    ...matchForStorage,
    config: enrichConfigWithBase64(matchForStorage.config),
  };

  // Send to main window
  ipcWebContentsSend(
    "onCurrentMatchSaved",
    mainWindow.webContents,
    matchForRenderer
  );

  // Send to scoreboard window if it exists
  if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
    ipcWebContentsSend(
      "onCurrentMatchSaved",
      scoreboardWindow.webContents,
      matchForRenderer
    );
  }
}

export function getCurrentMatch(): Match | null {
  const dataPath = join(app.getPath("userData"), "currentMatch.json");

  if (!existsSync(dataPath)) {
    return null;
  }

  try {
    const data = readFileSync(dataPath, "utf8").trim();

    if (!data) {
      return null;
    }

    const match: Match = JSON.parse(data);
    return match;
  } catch (error) {
    console.error("Error loading current match:", error);
    return null;
  }
}

export function removeCurrentMatch(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
) {
  try {
    const dataPath = join(app.getPath("userData"), "currentMatch.json");

    if (existsSync(dataPath)) {
      unlinkSync(dataPath);
      console.log("Current match file removed successfully");

      // Send to main window
      ipcWebContentsSend("onCurrentMatchRemoved", mainWindow.webContents, true);

      // Send to scoreboard window if it exists
      if (scoreboardWindow && !scoreboardWindow.isDestroyed()) {
        ipcWebContentsSend(
          "onCurrentMatchRemoved",
          scoreboardWindow.webContents,
          true
        );
      }
    } else {
      console.log("Current match file does not exist");
    }
  } catch (error) {
    console.error("Error removing current match file:", error);
  }
}

export function getMatches(): Match[] {
  const dataPath = join(app.getPath("userData"), "matches.json");

  if (!existsSync(dataPath)) {
    return [];
  }

  try {
    const data = readFileSync(dataPath, "utf8").trim();

    if (!data) {
      return [];
    }

    const matches: Match[] = JSON.parse(data);
    return matches;
  } catch (error) {
    console.error("Error loading matches:", error);
    return [];
  }
}

export function getMatchById(thisId: number): Match {
  const dataPath = join(app.getPath("userData"), "matches.json");

  if (!existsSync(dataPath)) {
    throw new Error("matches.json does not exist");
  }

  try {
    const data = readFileSync(dataPath, "utf8").trim();

    if (!data) {
      throw new Error("matches.json is empty");
    }

    const matches: Match[] = JSON.parse(data);

    const match = matches.find((m) => m.id === thisId);

    if (!match) {
      throw new Error(`Match with id ${thisId} not found`);
    }

    return match;
  } catch (error) {
    console.error("Error in getMatchById:", error);
    throw error; // rethrow so caller can handle it
  }
}

export function updateMatch(updatedMatch: Match): void {
  const dataPath = join(app.getPath("userData"), "matches.json");

  if (!existsSync(dataPath)) {
    console.log("No matches file found — nothing to update.");
    return;
  }

  try {
    const data = readFileSync(dataPath, "utf8");
    const matches: Match[] = JSON.parse(data);

    const matchIndex = matches.findIndex(
      (match) => match.id === updatedMatch.id
    );

    if (matchIndex === -1) {
      console.error(`Match with id ${updatedMatch.id} not found.`);
      return;
    }

    // Update the match at the found index
    matches[matchIndex] = updatedMatch;

    writeFileSync(dataPath, JSON.stringify(matches, null, 2));

    console.log(`Match with id ${updatedMatch.id} updated successfully.`);
  } catch (error) {
    console.error("Error updating match:", error);
  }
}

export function deleteMatchById(thisId: number): void {
  const dataPath = join(app.getPath("userData"), "matches.json");

  if (!existsSync(dataPath)) {
    console.log("No matches file found — nothing to delete.");
    return;
  }

  try {
    const data = readFileSync(dataPath, "utf8");
    const matches: Match[] = JSON.parse(data);

    const updatedMatches = matches.filter((match) => match.id !== thisId);

    writeFileSync(dataPath, JSON.stringify(updatedMatches, null, 2));

    console.log(`Match with id ${thisId} deleted.`);
  } catch (error) {
    console.error("Error deleting match:", error);
  }
}

// ---------- ---------- TEAMS ---------- ---------- //

export function saveTeam(team: Team): void {
  const dataPath = join(app.getPath("userData"), "teams.json");

  let existingTeams: Team[] = [];
  if (existsSync(dataPath)) {
    const data = readFileSync(dataPath, "utf8");
    existingTeams = JSON.parse(data);
  }

  // Check if a team with the same name already exists
  const existingIndex = existingTeams.findIndex((t) => t.name === team.name);

  if (existingIndex !== -1) {
    // Overwrite existing team
    existingTeams[existingIndex] = team;
    console.log(`Team "${team.name}" updated.`);
  } else {
    // Add new team
    existingTeams.push(team);
    console.log(`Team "${team.name}" saved.`);
  }

  writeFileSync(dataPath, JSON.stringify(existingTeams, null, 2));
}

export function getTeams(): Team[] {
  const dataPath = join(app.getPath("userData"), "teams.json");

  if (!existsSync(dataPath)) {
    return [];
  }

  try {
    const data = readFileSync(dataPath, "utf8").trim();

    if (!data) {
      return [];
    }

    const teams: Team[] = JSON.parse(data);
    return teams;
  } catch (error) {
    console.error("Error loading teams:", error);
    return [];
  }
}

export function deleteTeamByName(teamName: string): void {
  const dataPath = join(app.getPath("userData"), "teams.json");

  if (!existsSync(dataPath)) {
    console.log("No teams file found — nothing to delete.");
    return;
  }

  try {
    const data = readFileSync(dataPath, "utf8");
    const teams: Team[] = JSON.parse(data);

    const updatedTeams = teams.filter((team) => team.name !== teamName);

    writeFileSync(dataPath, JSON.stringify(updatedTeams, null, 2));

    console.log(`Team "${teamName}" deleted.`);
  } catch (error) {
    console.error("Error deleting team:", error);
  }
}

export function loadCurrentTeam(
  team: Team,
  isTeamHome: boolean,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to load team into");
    return;
  }

  // Initialize teams object if it doesn't exist
  if (!currentMatch.teams) {
    currentMatch.teams = {};
  }

  // Update the appropriate team
  if (isTeamHome) {
    currentMatch.teams.teamA = team;
    console.log(`Team "${team.name}" loaded as Home Team (Team A)`);
  } else {
    currentMatch.teams.teamB = team;
    console.log(`Team "${team.name}" loaded as Away Team (Team B)`);
  }

  // Save the updated match
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
}

export function removeTeamFromCurrentMatch(
  isTeamHome: boolean,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to remove team from");
    return;
  }

  // Initialize teams object if it doesn't exist
  if (!currentMatch.teams) {
    console.log("No teams to remove");
    return;
  }

  // Remove the appropriate team
  if (isTeamHome) {
    currentMatch.teams.teamA = undefined;
    console.log("Home Team (Team A) removed from current match");
  } else {
    currentMatch.teams.teamB = undefined;
    console.log("Away Team (Team B) removed from current match");
  }

  // Save the updated match
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
}

export function saveConfigToCurrentMatch(
  config: MatchConfig,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to save config to");
    return;
  }

  // Update the config
  currentMatch.config = sanitizeConfigForStorage(config);
  console.log(`Config saved to current match`);

  // Save the updated match
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
}

export function getImageAsBase64(imagePath: string): string | null {
  try {
    if (!existsSync(imagePath)) {
      console.error(`Image file not found: ${imagePath}`);
      return null;
    }

    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const ext = extname(imagePath).toLowerCase();

    // Determine MIME type based on extension
    let mimeType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") {
      mimeType = "image/jpeg";
    } else if (ext === ".png") {
      mimeType = "image/png";
    }

    // Return data URL format
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
}

// ---------- ---------- SCORE ---------- ---------- //

export function updateTeamAScore(
  score: Score,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to update Team A score");
    return;
  }

  currentMatch.teamAScore = score;
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
  console.log("Team A score updated:", score);
}

export function updateTeamBScore(
  score: Score,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to update Team B score");
    return;
  }

  currentMatch.teamBScore = score;
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
  console.log("Team B score updated:", score);
}

export function incrementTeamASets(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to increment Team A sets");
    return;
  }

  // Initialize scores if not present
  if (!currentMatch.teamAScore) {
    currentMatch.teamAScore = { points: 0, sets: 0, timeouts: 0 };
  }
  if (!currentMatch.teamBScore) {
    currentMatch.teamBScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentSets = currentMatch.teamAScore?.sets || 0;
  const opponentSets = currentMatch.teamBScore?.sets || 0;

  // Can't increment if either team has already won (reached 3 sets)
  if (currentSets >= 3 || opponentSets >= 3) {
    console.log("Match is over - a team has already won 3 sets");
    return;
  }

  // Calculate which set just finished (total sets played so far + 1)
  const totalSetsPlayed =
    currentMatch.teamAScore.sets + (currentMatch.teamBScore?.sets || 0);
  const completedSetNum = totalSetsPlayed + 1;

  // Calculate time duration for this set
  const currentTimeSec = currentMatch.timeSec || 0;
  let setStartTime = 0;

  // Initialize setHistory if not present
  if (!currentMatch.setHistory) {
    currentMatch.setHistory = [];
  }

  // Calculate start time of current set (sum of all previous set times)
  if (currentMatch.setHistory.length > 0) {
    setStartTime = currentMatch.setHistory.reduce(
      (sum, set) => sum + set.timeSec,
      0
    );
  }

  const setDuration = currentTimeSec - setStartTime;

  // Record the set history before resetting points (max 5 sets)
  const setRecord = {
    setNum: completedSetNum,
    teamAPoints: currentMatch.teamAScore.points,
    teamBPoints: currentMatch.teamBScore?.points || 0,
    timeSec: setDuration,
  };

  // Check if a set with this number already exists
  const existingSetIndex = currentMatch.setHistory.findIndex(
    (s) => s.setNum === completedSetNum
  );

  if (existingSetIndex !== -1) {
    // Overwrite existing set
    currentMatch.setHistory[existingSetIndex] = setRecord;
    console.log("Set overwritten in history:", setRecord);
  } else if (currentMatch.setHistory.length < 5) {
    // Add new set if there's room
    currentMatch.setHistory.push(setRecord);
    console.log("Set recorded in history:", setRecord);
  } else {
    console.log("Set history already has 5 sets - not recording more");
  }

  // Increment sets
  if (currentMatch.teamAScore) {
    currentMatch.teamAScore.sets = currentSets + 1;

    // Reset points and timeouts for both teams if going to 1 or 2 (not to 3)
    if (currentMatch.teamAScore.sets < 3) {
      if (currentMatch.teamAScore) {
        currentMatch.teamAScore.points = 0;
        currentMatch.teamAScore.timeouts = 0;
      }
      if (currentMatch.teamBScore) {
        currentMatch.teamBScore.points = 0;
        currentMatch.teamBScore.timeouts = 0;
      }
      console.log("Both teams' points and timeouts reset to 0");
    }

    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log("Team A sets incremented to:", currentMatch.teamAScore.sets);
  }
}

export function decrementTeamASets(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to decrement Team A sets");
    return;
  }

  if (!currentMatch.teamAScore) {
    currentMatch.teamAScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentSets = currentMatch.teamAScore?.sets || 0;

  // Can't go below 0
  if (currentSets <= 0) {
    console.log("Team A sets already at minimum (0)");
    return;
  }

  if (currentMatch.teamAScore) {
    currentMatch.teamAScore.sets = currentSets - 1;
    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log("Team A sets decremented to:", currentMatch.teamAScore.sets);
  }
}

export function incrementTeamBSets(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to increment Team B sets");
    return;
  }

  // Initialize scores if not present
  if (!currentMatch.teamAScore) {
    currentMatch.teamAScore = { points: 0, sets: 0, timeouts: 0 };
  }
  if (!currentMatch.teamBScore) {
    currentMatch.teamBScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentSets = currentMatch.teamBScore?.sets || 0;
  const opponentSets = currentMatch.teamAScore?.sets || 0;

  // Can't increment if either team has already won (reached 3 sets)
  if (currentSets >= 3 || opponentSets >= 3) {
    console.log("Match is over - a team has already won 3 sets");
    return;
  }

  // Calculate which set just finished (total sets played so far + 1)
  const totalSetsPlayed =
    (currentMatch.teamAScore?.sets || 0) + currentMatch.teamBScore.sets;
  const completedSetNum = totalSetsPlayed + 1;

  // Calculate time duration for this set
  const currentTimeSec = currentMatch.timeSec || 0;
  let setStartTime = 0;

  // Initialize setHistory if not present
  if (!currentMatch.setHistory) {
    currentMatch.setHistory = [];
  }

  // Calculate start time of current set (sum of all previous set times)
  if (currentMatch.setHistory.length > 0) {
    setStartTime = currentMatch.setHistory.reduce(
      (sum, set) => sum + set.timeSec,
      0
    );
  }

  const setDuration = currentTimeSec - setStartTime;

  // Record the set history before resetting points (max 5 sets)
  const setRecord = {
    setNum: completedSetNum,
    teamAPoints: currentMatch.teamAScore?.points || 0,
    teamBPoints: currentMatch.teamBScore.points,
    timeSec: setDuration,
  };

  // Check if a set with this number already exists
  const existingSetIndex = currentMatch.setHistory.findIndex(
    (s) => s.setNum === completedSetNum
  );

  if (existingSetIndex !== -1) {
    // Overwrite existing set
    currentMatch.setHistory[existingSetIndex] = setRecord;
    console.log("Set overwritten in history:", setRecord);
  } else if (currentMatch.setHistory.length < 5) {
    // Add new set if there's room
    currentMatch.setHistory.push(setRecord);
    console.log("Set recorded in history:", setRecord);
  } else {
    console.log("Set history already has 5 sets - not recording more");
  }

  // Increment sets
  if (currentMatch.teamBScore) {
    currentMatch.teamBScore.sets = currentSets + 1;

    // Reset points and timeouts for both teams if going to 1 or 2 (not to 3)
    if (currentMatch.teamBScore.sets < 3) {
      if (currentMatch.teamAScore) {
        currentMatch.teamAScore.points = 0;
        currentMatch.teamAScore.timeouts = 0;
      }
      if (currentMatch.teamBScore) {
        currentMatch.teamBScore.points = 0;
        currentMatch.teamBScore.timeouts = 0;
      }
      console.log("Both teams' points and timeouts reset to 0");
    }

    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log("Team B sets incremented to:", currentMatch.teamBScore.sets);
  }
}

export function decrementTeamBSets(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to decrement Team B sets");
    return;
  }

  if (!currentMatch.teamBScore) {
    currentMatch.teamBScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentSets = currentMatch.teamBScore?.sets || 0;

  // Can't go below 0
  if (currentSets <= 0) {
    console.log("Team B sets already at minimum (0)");
    return;
  }

  if (currentMatch.teamBScore) {
    currentMatch.teamBScore.sets = currentSets - 1;
    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log("Team B sets decremented to:", currentMatch.teamBScore.sets);
  }
}

// ---------- ---------- TIMEOUTS ---------- ---------- //

export function incrementTeamATimeouts(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to increment Team A timeouts");
    return;
  }

  if (!currentMatch.teamAScore) {
    currentMatch.teamAScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentTimeouts = currentMatch.teamAScore?.timeouts || 0;

  // Can't go above 2
  if (currentTimeouts >= 2) {
    console.log("Team A timeouts already at maximum (2)");
    return;
  }

  if (currentMatch.teamAScore) {
    currentMatch.teamAScore.timeouts = currentTimeouts + 1;
    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log(
      "Team A timeouts incremented to:",
      currentMatch.teamAScore.timeouts
    );
  }
}

export function decrementTeamATimeouts(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to decrement Team A timeouts");
    return;
  }

  if (!currentMatch.teamAScore) {
    currentMatch.teamAScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentTimeouts = currentMatch.teamAScore?.timeouts || 0;

  // Can't go below 0
  if (currentTimeouts <= 0) {
    console.log("Team A timeouts already at minimum (0)");
    return;
  }

  if (currentMatch.teamAScore) {
    currentMatch.teamAScore.timeouts = currentTimeouts - 1;
    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log(
      "Team A timeouts decremented to:",
      currentMatch.teamAScore.timeouts
    );
  }
}

export function incrementTeamBTimeouts(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to increment Team B timeouts");
    return;
  }

  if (!currentMatch.teamBScore) {
    currentMatch.teamBScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentTimeouts = currentMatch.teamBScore?.timeouts || 0;

  // Can't go above 2
  if (currentTimeouts >= 2) {
    console.log("Team B timeouts already at maximum (2)");
    return;
  }

  if (currentMatch.teamBScore) {
    currentMatch.teamBScore.timeouts = currentTimeouts + 1;
    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log(
      "Team B timeouts incremented to:",
      currentMatch.teamBScore.timeouts
    );
  }
}

export function decrementTeamBTimeouts(
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to decrement Team B timeouts");
    return;
  }

  if (!currentMatch.teamBScore) {
    currentMatch.teamBScore = { points: 0, sets: 0, timeouts: 0 };
  }

  const currentTimeouts = currentMatch.teamBScore?.timeouts || 0;

  // Can't go below 0
  if (currentTimeouts <= 0) {
    console.log("Team B timeouts already at minimum (0)");
    return;
  }

  if (currentMatch.teamBScore) {
    currentMatch.teamBScore.timeouts = currentTimeouts - 1;
    saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
    console.log(
      "Team B timeouts decremented to:",
      currentMatch.teamBScore.timeouts
    );
  }
}

// ---------- ---------- SET HISTORY ---------- ---------- //

export function updateSetHistory(
  setHistory: Array<{
    setNum: number;
    teamAPoints: number;
    teamBPoints: number;
    timeSec: number;
  }>,
  mainWindow: BrowserWindow,
  scoreboardWindow?: BrowserWindow
): void {
  const currentMatch = getCurrentMatch();

  if (!currentMatch) {
    console.error("No current match found to update set history");
    return;
  }

  // Limit to 5 sets maximum
  if (setHistory.length > 5) {
    console.log("Truncating set history to 5 sets");
    setHistory = setHistory.slice(0, 5);
  }

  // Validate that set numbers are unique and in range 1-5
  const setNums = setHistory.map((s) => s.setNum);
  const uniqueSetNums = new Set(setNums);

  if (setNums.length !== uniqueSetNums.size) {
    console.error("Duplicate set numbers detected in set history");
    return;
  }

  const invalidSetNums = setNums.filter((num) => num < 1 || num > 5);
  if (invalidSetNums.length > 0) {
    console.error("Invalid set numbers (must be 1-5):", invalidSetNums);
    return;
  }

  currentMatch.setHistory = setHistory;
  saveCurrentMatch(currentMatch, mainWindow, scoreboardWindow);
  console.log("Set history updated:", setHistory);
}
