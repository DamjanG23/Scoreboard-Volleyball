import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";

interface ToggleScoreboardFillButtonProps {
  scoreboardVisibility: boolean;
}

export function ToggleScoreboardFillButton({
  scoreboardVisibility,
}: ToggleScoreboardFillButtonProps) {
  const [isFilled, setIsFilled] = useState(false);

  useEffect(() => {
    window.electron.getScoreboardFillState().then(setIsFilled);
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.onScoreboardFillStateChange(
      (fillState) => {
        setIsFilled(fillState);
      }
    );

    return unsubscribe;
  }, []);

  const handleToggle = async () => {
    await window.electron.toggleScoreboardFill();
  };

  return (
    <Button
      disabled={!scoreboardVisibility}
      onClick={handleToggle}
      startIcon={isFilled ? <FullscreenExit /> : <Fullscreen />}
    >
      {isFilled ? "Empty Scoreboard" : "Fill Scoreboard"}
    </Button>
  );
}
