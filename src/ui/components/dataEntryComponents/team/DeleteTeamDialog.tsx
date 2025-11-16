import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface DeleteTeamDialogProps {
  open: boolean;
  teamName: string | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTeamDialog({
  open,
  teamName,
  onClose,
  onConfirm,
}: DeleteTeamDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Team</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the team "{teamName}"? This action
          cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

