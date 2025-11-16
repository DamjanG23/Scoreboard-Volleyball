import { app, BrowserWindow } from "electron";
import { ipcWebContentsSend } from "../utils/util.js";
import { join } from "path";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";

export function getScoreboardState() {
  const scoreboardState: string = "scoreboardState 123";
  const teamAName: string = "Rabotnicki";
  const teamBName: string = "Strumica";
  return { scoreboardState, teamAName, teamBName };
}

export function getConfig() {
  const matchConfig: MatchConfig = {
    config: "string",
    timeoutDurationSec: 11,
    intervalBetweenSetsSec: 12,
  };
  return matchConfig;
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

export function saveCurrentMatch(match: Match, window: BrowserWindow) {
  const dataPath = join(app.getPath("userData"), "currentMatch.json");
  writeFileSync(dataPath, JSON.stringify(match, null, 2));
  console.log("Current match:", match);
  ipcWebContentsSend("onCurrentMatchSaved", window.webContents, match);
}

export function removeCurrentMatch(window: BrowserWindow) {
  try {
    const dataPath = join(app.getPath("userData"), "currentMatch.json");

    if (existsSync(dataPath)) {
      unlinkSync(dataPath);
      console.log("Current match file removed successfully");
      ipcWebContentsSend("onCurrentMatchRemoved", window.webContents, true);
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
