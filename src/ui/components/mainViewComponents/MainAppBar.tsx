import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

interface MainAppBarProps {
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainAppBar({ setIsDrawerOpen }: MainAppBarProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setIsDrawerOpen(true)}
        >
          <ChevronRight />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6">VFMKD Scoreboard</Typography>
        </Box>
        <IconButton edge="end" disabled={true} />
      </Toolbar>
    </AppBar>
  );
}
