type Match = {
  id: number;
  matchName: string;
  config?: MatchConfig;
  teams?: MatchTeams;
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

// ----- ----- ----- ----- ----- ENUMS ----- ----- ----- ----- ----- //

type SelectedDataView = "CONFIG" | "TEAMS" | "SCORE";

// ----- ----- ----- ----- ----- FUNCTIONS ----- ----- ----- ----- ----- //

type EventPayloadMaping = {
  getMatchSeconds: MatchTime;
  getScoreboardState: ScoreboardState;
  getConfig: MatchConfig;
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
  createNewMatch: string;
  onCurrentMatchSaved: Match;
  removeCurrentMatch: void;
  onCurrentMatchRemoved: boolean;
  getMatches: Match[];
  loadMatch: number;
  deleteMatch: number;
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    getMatchSeconds: (
      callback: (matchtime: MatchTime) => void
    ) => UnsubscribeFunction;

    getScoreboardState: () => Promise<ScoreboardState>;

    getConfig: () => Promise<MatchConfig>;

    getIsScoreboardOpen: () => Promise<boolean>;

    showScoreboardWindow: () => Promise<boolean>;

    closeScoreboardWindow: () => Promise<boolean>;

    toggleScoreboardFullscreen: () => Promise<boolean>;

    toggleMainFullscreen: () => Promise<boolean>;

    createNewMatch: (matchName: string) => void;

    removeCurrentMatch: () => void;

    getMatches: () => Promise<Match[]>;

    loadMatch: (id: number) => void;

    deleteMatch: (id: number) => void;

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

    onCurrentMatchSaved: (
      callback: (currentMatch: Match) => void
    ) => UnsubscribeFunction;

    onCurrentMatchRemoved: (
      callback: (isCurrentMatchRemoved: boolean) => void
    ) => UnsubscribeFunction;
  };
}
