import { Drawer } from "@mui/material";

export default function MainView() {
  return (
    <div>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
        }}
      >
        <div>Drawer!</div>
      </Drawer>
      <div>Main Window Content</div>
    </div>
  );
}
