import { Button, Divider, Drawer } from "@mui/material";
import { useState } from "react";

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

export function SideDrawer() {
  const [isMainViewFullScreen, setIsMainViewFullScreen] = useState(false);

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
      <Button> Open/Close Scoreboard </Button>

      <Button> FS Scoreboard </Button>

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
