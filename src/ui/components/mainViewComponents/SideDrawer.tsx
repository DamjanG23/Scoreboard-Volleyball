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
import { ТoggleScoreboardVisibilityButton } from "./sideDrawerComponents/ТoggleScoreboardVisibilityButton";
import { ToggleScoreboardFullscreenButton } from "./sideDrawerComponents/ToggleScoreboardFullscreenButton";
import { ToggleMainFullscreenButton } from "./sideDrawerComponents/ToggleMainFullscreenButton";

interface SideDrawerProps {
  isMatchLoaded: boolean;
}

export function SideDrawer({ isMatchLoaded }: SideDrawerProps) {
  const [scoreboardVisibility, setScoreboardVisibility] = useState(false);

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
      <ТoggleScoreboardVisibilityButton
        scoreboardVisibility={scoreboardVisibility}
      />

      <ToggleScoreboardFullscreenButton
        scoreboardVisibility={scoreboardVisibility}
      />

      <ToggleMainFullscreenButton />

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
