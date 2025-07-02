import {
  Button,
  Divider,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

interface SideDrawerProps {
  isMatchLoaded: boolean;
}

export function SideDrawer({ isMatchLoaded }: SideDrawerProps) {
  const [scoreboardVisibility, setScoreboardVisibility] = useState(false);
  const [isScoreboardFullScreen, setIsScoreboardFullScreen] = useState(false);
  const [isMainFullScreen, setIsMainFullScreen] = useState(false);
  const [isNewMatchNameDialogOpen, setIsNewMatchDialogOpen] = useState(false);
  const [matchName, setMatchName] = useState("");

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

  useEffect(() => {
    const unsubscribe = window.electron.onMainFullscreenChange(
      (isFullScreen) => {
        setIsMainFullScreen(isFullScreen);
      }
    );

    return unsubscribe;
  }, []);

  const handleCreateNewMatch = () => {
    console.log(`Match with name "${matchName}" was created`);
    setIsNewMatchDialogOpen(false);
    setMatchName("");
  };

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
        FS Scoreboard
      </Button>

      {/* TOGGLE MAIN SCREEN FULLSCREEN*/}
      <Button
        //variant="outlined"
        color={isMainFullScreen ? "error" : "success"}
        startIcon={
          isMainFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />
        }
        onClick={window.electron.toggleMainFullscreen}
      >
        FS Main Window
      </Button>

      <Divider />

      <Button disabled={isMatchLoaded ? false : true}> Config </Button>

      <Button disabled={isMatchLoaded ? false : true}> Teams </Button>

      <Button disabled={isMatchLoaded ? false : true}> Score </Button>

      <Divider />

      <Button onClick={() => setIsNewMatchDialogOpen(true)}> New Match </Button>

      <Button> Load Match </Button>

      <Button disabled={isMatchLoaded ? false : true}> Close Match </Button>

      <Dialog
        open={isNewMatchNameDialogOpen}
        onClose={() => setIsNewMatchDialogOpen(false)}
      >
        <DialogTitle>Name Your Match</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Match Name"
            fullWidth
            variant="outlined"
            value={matchName}
            onChange={(e) => setMatchName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewMatchDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateNewMatch}
            disabled={matchName.trim().length === 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
