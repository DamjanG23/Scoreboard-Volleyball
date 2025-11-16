import { useState } from "react";
import { SideDrawer } from "./components/mainViewComponents/SideDrawer";
import { MainAppBar } from "./components/mainViewComponents/MainAppBar";
import { Config } from "./components/dataEntryComponents/Config";
import { Score } from "./components/dataEntryComponents/Score";
import { Teams } from "./components/dataEntryComponents/Teams";

interface MainViewProps {
  isMatchLoaded: boolean;
}

export default function MainView({ isMatchLoaded }: MainViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDataView, setSelectedDataView] =
    useState<SelectedDataView>("CONFIG");

  function renderSelectedView() {
    if (selectedDataView === "CONFIG") return <Config text="Config" />;
    if (selectedDataView === "TEAMS") return <Teams text="Teams" />;
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

      <>
        {isMatchLoaded
          ? renderSelectedView()
          : "///////////////////////////////// Please Load/Start a Match!"}
      </>
    </>
  );
}
