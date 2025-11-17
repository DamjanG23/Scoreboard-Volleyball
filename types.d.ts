type Match = {
  id: number;
  matchName: string;
  config?: MatchConfig;
  teams?: MatchTeams;
  teamAScore?: Score;
  teamBScore?: Score;
  timeSec?: number;
  setHistory?: Set[];
};

type Set = {
  setNum: number;
  teamAPoints: number;
  teamBPoints: number;
  timeSec: number;
};

type Score = {
  points: number;
  sets: number;
  timeouts: number;
};

type ScoreboardState = {
  scoreboardState: string;
  teamAName: string;
  teamBName: string;
};

type MatchConfig = {
  config: string;
  timeoutDurationSec: number;
  intervalBetweenSetsSec: number;
};

type MatchTime = {
  seconds: number;
};

type MatchTeams = {
  teamA?: Team;
  teamB?: Team;
};

type Team = {
  name: string;
  coach: string;
  players: Player[];
  logoPath: string;
  color: string;
};

type Player = {
  number: number;
  name: string;
};

// ---------- ---------- ENUMS ---------- ---------- //

type SelectedDataView = "CONFIG" | "TEAMS" | "SCORE";

// ---------- ---------- FUNCTIONS ---------- ---------- //

type EventPayloadMaping = {
  getMatchSeconds: MatchTime;
  getScoreboardState: ScoreboardState;
  getConfig: MatchConfig;
  saveConfig: MatchConfig;
  getIsScoreboardOpen: boolean;
  onScoreboardWindowChange: boolean;
  onScoreboardWindowClosed: boolean;
  onScoreboardWindowOpened: boolean;
  showScoreboardWindow: boolean;
  closeScoreboardWindow: boolean;
  toggleScoreboardFullscreen: boolean;
  onScoreboardFullscreenChange: boolean;
  toggleMainFullscreen: boolean;
  onMainFullscreenChange: boolean;
  selectLogoFile: string | null;
  createNewMatch: string;
  onCurrentMatchSaved: Match;
  removeCurrentMatch: void;
  onCurrentMatchRemoved: boolean;
  getMatches: Match[];
  loadMatch: number;
  deleteMatch: number;
  updateMatch: void;
  getTeams: Team[];
  saveTeam: Team;
  saveTeamA: Team;
  saveTeamB: Team;
  removeTeamA: void;
  removeTeamB: void;
  deleteTeam: string;
  getImageAsBase64: string | null;
  startMatchTime: void;
  stopMatchTime: void;
  isMatchTimeRunning: boolean;
  startWarmupTime: void;
  stopWarmupTime: void;
  isWarmupTimeRunning: boolean;
  updateMatchTime: number;
  updateTeamAScore: Score;
  updateTeamBScore: Score;
  incrementTeamASets: void;
  decrementTeamASets: void;
  incrementTeamBSets: void;
  decrementTeamBSets: void;
  incrementTeamATimeouts: void;
  decrementTeamATimeouts: void;
  incrementTeamBTimeouts: void;
  decrementTeamBTimeouts: void;
  updateSetHistory: Array<{
    setNum: number;
    teamAPoints: number;
    teamBPoints: number;
    timeSec: number;
  }>;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    // ---------- ---------- DONT NEED I THINK ---------- ---------- //

    getMatchSeconds: (
      callback: (matchtime: MatchTime) => void
    ) => UnsubscribeFunction;

    getScoreboardState: () => Promise<ScoreboardState>;

    getConfig: () => Promise<MatchConfig>;

    saveConfig: (config: MatchConfig) => void;

    // ---------- ---------- WINDOW ---------- ---------- //
    getIsScoreboardOpen: () => Promise<boolean>;

    showScoreboardWindow: () => Promise<boolean>;

    closeScoreboardWindow: () => Promise<boolean>;

    toggleScoreboardFullscreen: () => Promise<boolean>;

    toggleMainFullscreen: () => Promise<boolean>;

    onScoreboardWindowClosed: (
      callback: (isClosed: boolean) => void
    ) => UnsubscribeFunction;

    onScoreboardWindowOpened: (
      callback: (isOpened: boolean) => void
    ) => UnsubscribeFunction;

    onScoreboardFullscreenChange: (
      callback: (isFullscreen: boolean) => void
    ) => UnsubscribeFunction;

    onMainFullscreenChange: (
      callback: (isFullscreen: boolean) => void
    ) => UnsubscribeFunction;

    selectLogoFile: () => Promise<string | null>;

    // ---------- ---------- MATCH ---------- ---------- //

    createNewMatch: (matchName: string) => void;

    removeCurrentMatch: () => void;

    getMatches: () => Promise<Match[]>;

    loadMatch: (id: number) => void;

    deleteMatch: (id: number) => void;

    updateMatch: () => void;

    onCurrentMatchSaved: (
      callback: (currentMatch: Match) => void
    ) => UnsubscribeFunction;

    onCurrentMatchRemoved: (
      callback: (isCurrentMatchRemoved: boolean) => void
    ) => UnsubscribeFunction;

    // ---------- ---------- TEAMS ---------- ---------- //

    getTeams: () => Promise<Team[]>;

    saveTeam: (team: Team) => void;

    saveTeamA: (team: Team) => void;

    saveTeamB: (team: Team) => void;

    removeTeamA: () => void;

    removeTeamB: () => void;

    deleteTeam: (teamName: string) => void;

    getImageAsBase64: (imagePath: string) => Promise<string | null>;

    // ---------- ---------- TIME ---------- ---------- //

    startMatchTime: () => void;

    stopMatchTime: () => void;

    isMatchTimeRunning: () => Promise<boolean>;

    startWarmupTime: () => void;

    stopWarmupTime: () => void;

    isWarmupTimeRunning: () => Promise<boolean>;

    updateMatchTime: (newTimeSec: number) => void;

    // ---------- ---------- SCORE ---------- ---------- //

    updateTeamAScore: (score: Score) => void;

    updateTeamBScore: (score: Score) => void;

    incrementTeamASets: () => void;

    decrementTeamASets: () => void;

    incrementTeamBSets: () => void;

    decrementTeamBSets: () => void;

    // ---------- ---------- TIMEOUTS ---------- ---------- //

    incrementTeamATimeouts: () => void;

    decrementTeamATimeouts: () => void;

    incrementTeamBTimeouts: () => void;

    decrementTeamBTimeouts: () => void;

    // ---------- ---------- SET HISTORY ---------- ---------- //

    updateSetHistory: (
      setHistory: Array<{
        setNum: number;
        teamAPoints: number;
        teamBPoints: number;
        timeSec: number;
      }>
    ) => void;
  };
}
