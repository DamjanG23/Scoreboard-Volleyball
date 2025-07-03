type ScoreboardState = {
  scoreboardState: string;
  teamAName: string;
  teamBName: string;
};

type MatchConfig = {
  config: string;
};

type MatchTime = {
  seconds: number;
};

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
  };
}
