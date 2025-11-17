import { Button } from "@mui/material";

interface SaveMatchButtonProps {
  isMatchLoaded: boolean;
}

export function SaveMatchButton({ isMatchLoaded }: SaveMatchButtonProps) {
  return (
    <Button disabled={!isMatchLoaded} onClick={window.electron.updateMatch}>
      Save Match
    </Button>
  );
}
