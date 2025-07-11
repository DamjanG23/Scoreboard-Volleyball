import { Button, Divider, Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { ТoggleScoreboardVisibilityButton } from "./sideDrawerComponents/ТoggleScoreboardVisibilityButton";
import { ToggleScoreboardFullscreenButton } from "./sideDrawerComponents/ToggleScoreboardFullscreenButton";
import { ToggleMainFullscreenButton } from "./sideDrawerComponents/ToggleMainFullscreenButton";
import { NewMatchButton } from "./sideDrawerComponents/NewMatchButton";
import { ExitMatchButton } from "./sideDrawerComponents/ExitMatchButton";
import { LoadMatchButton } from "./sideDrawerComponents/LoadMatchButton";

interface SideDrawerProps {
  isMatchLoaded: boolean;
  open: boolean;
  onClose: () => void;
}

export function SideDrawer({ isMatchLoaded, open, onClose }: SideDrawerProps) {
  const [scoreboardVisibility, setScoreboardVisibility] = useState(false);

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

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      sx={{
        width: 240,
        "& .MuiDrawer-paper": {
          width: 240,
        },
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

      {/*--------------- Implement these buttons -----------------*/}

      <Button disabled={isMatchLoaded ? false : true}> Config </Button>

      <Button disabled={isMatchLoaded ? false : true}> Teams </Button>

      <Button disabled={isMatchLoaded ? false : true}> Score </Button>

      {/*----------------------------------------------------------*/}

      <Divider />

      <NewMatchButton />

      <LoadMatchButton />

      <ExitMatchButton isMatchLoaded={isMatchLoaded} />
    </Drawer>
  );
}
