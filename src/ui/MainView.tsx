import { useState } from "react";
import { SideDrawer } from "./components/mainViewComponents/SideDrawer";
import { MainAppBar } from "./components/mainViewComponents/MainAppBar";

interface MainViewProps {
  isMatchLoaded: boolean;
}

export default function MainView({ isMatchLoaded }: MainViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <MainAppBar setIsDrawerOpen={setIsDrawerOpen} />

      <SideDrawer
        isMatchLoaded={isMatchLoaded}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <>
        {isMatchLoaded
          ? ""
          : "///////////////////////////////// Please Load/Start a Match!"}
      </>
    </>
  );
}
