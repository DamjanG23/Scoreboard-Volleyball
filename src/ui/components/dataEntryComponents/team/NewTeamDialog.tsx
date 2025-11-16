import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface NewTeamDialogProps {
  open: boolean;
  teamName: string;
  onTeamNameChange: (name: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

export function NewTeamDialog({
  open,
  teamName,
  onTeamNameChange,
  onClose,
  onCreate,
}: NewTeamDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Team</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Team Name"
          fullWidth
          variant="outlined"
          value={teamName}
          onChange={(e) => onTeamNameChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onCreate}
          disabled={teamName.trim().length === 0}
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

