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
  getMatchSeconds: MatchTime,
  getScoreboardState: ScoreboardState,
  getConfig: MatchConfig
};

interface Window {
  electron: {
    test: () => void;

    getMatchSeconds: (callback: (matchtime: MatchTime) => void) => void;

    getScoreboardState: () => Promise<ScoreboardState>;

    getConfig: () => Promise<MatchConfig>;
  };
}
