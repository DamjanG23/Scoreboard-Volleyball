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
};

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    test: () => void;

    getMatchSeconds: (
      callback: (matchtime: MatchTime) => void
    ) => UnsubscribeFunction;

    getScoreboardState: () => Promise<ScoreboardState>;

    getConfig: () => Promise<MatchConfig>;

    getIsScoreboardOpen: () => Promise<boolean>;
  };
}
