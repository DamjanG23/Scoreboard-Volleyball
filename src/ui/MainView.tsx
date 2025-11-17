import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { SideDrawer } from "./components/mainViewComponents/SideDrawer";
import { MainAppBar } from "./components/mainViewComponents/MainAppBar";
import { Config } from "./components/dataEntryComponents/Config";
import { Score } from "./components/dataEntryComponents/Score";
import { Teams } from "./components/dataEntryComponents/team/Teams";

interface MainViewProps {
  currentMatch: Match | null;
}

export default function MainView({ currentMatch }: MainViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDataView, setSelectedDataView] =
    useState<SelectedDataView>("CONFIG");
  const isMatchLoaded = currentMatch === null ? false : true;

  function renderSelectedView() {
    if (selectedDataView === "CONFIG")
      return <Config matchConfig={currentMatch?.config} />;
    if (selectedDataView === "TEAMS")
      return <Teams matchTeams={currentMatch?.teams} />;
    if (selectedDataView === "SCORE") return <Score text="Score" />;
    return null;
  }

  return (
    <>
      <MainAppBar setIsDrawerOpen={setIsDrawerOpen} />

      <SideDrawer
        isMatchLoaded={isMatchLoaded}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setSelectedDataView={setSelectedDataView}
      />

      <Box>
        {isMatchLoaded ? (
          renderSelectedView()
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 64px)",
            }}
          >
            <Typography variant="h4" color="text.secondary">
              Please Load/Start a Match!
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
