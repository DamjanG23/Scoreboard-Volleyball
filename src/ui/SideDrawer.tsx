import { Button, Divider, Drawer } from "@mui/material";
import { useEffect, useState } from "react";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import VisibilityIcon from "@mui/icons-material/Visibility"; // 👁️ open
import CloseIcon from "@mui/icons-material/Close";

export function SideDrawer() {
  const [isMainViewFullScreen, setIsMainViewFullScreen] = useState(false);
  const [scoreboardVisibility, setScoreboardVisibility] = useState(false);
  const [isScoreboardFullScreen, setIsScoreboardFullScreen] = useState(false);

  useEffect(() => {
    window.electron.getIsScoreboardOpen().then(setScoreboardVisibility);
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.onScoreboardWindowClosed(() => {
      setScoreboardVisibility(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.onScoreboardWindowOpened(() => {
      setScoreboardVisibility(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.onScoreboardFullscreenChange(
      (isFullScreen) => {
        setIsScoreboardFullScreen(isFullScreen);
      }
    );

    return unsubscribe;
  }, []);

  function toggleIsMainViewFullScreen() {
    setIsMainViewFullScreen((isFullScreen) => !isFullScreen);
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
      }}
    >
      {/* SHOW/CLOSE SCOREBOARD */}
      <Button
        //variant="outlined"
        color={scoreboardVisibility ? "error" : "success"}
        onClick={
          scoreboardVisibility
            ? window.electron.closeScoreboardWindow
            : window.electron.showScoreboardWindow
        }
        startIcon={scoreboardVisibility ? <CloseIcon /> : <VisibilityIcon />}
      >
        {scoreboardVisibility ? "Close Scoreboard" : "Open Scoreboard"}
      </Button>

      {/* TOGGLE SCOREBOARD FULLSCREEN*/}
      <Button
        //variant="outlined"
        disabled={scoreboardVisibility ? false : true}
        color={isScoreboardFullScreen ? "error" : "success"}
        onClick={window.electron.toggleScoreboardFullscreen}
        startIcon={
          isScoreboardFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />
        }
      >
        FS Scoreboard{" "}
      </Button>

      <Button
        //variant="outlined"
        //color="primary"
        startIcon={
          isMainViewFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />
        }
        onClick={toggleIsMainViewFullScreen}
        //disabled={!isMatchActive}
      >
        FS Main Window
      </Button>

      <Divider />

      <Button> Config </Button>

      <Button> Teams </Button>

      <Button> Score </Button>

      <Divider />

      <Button> New Match </Button>

      <Button> Load Match </Button>
    </Drawer>
  );
}
