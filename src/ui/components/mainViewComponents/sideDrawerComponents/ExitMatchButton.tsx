import { Button } from "@mui/material";

interface ExitMatchButtonProps {
  isMatchLoaded: boolean;
}

export function ExitMatchButton({ isMatchLoaded }: ExitMatchButtonProps) {
  return (
    <Button
      disabled={isMatchLoaded ? false : true}
      onClick={window.electron.removeCurrentMatch}
    >
      {" "}
      Exit Match{" "}
    </Button>
  );
}
