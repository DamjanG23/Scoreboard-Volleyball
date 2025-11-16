import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

interface LoadTeamDialogProps {
  open: boolean;
  teams: Team[];
  onClose: () => void;
  onLoadTeam: (team: Team) => void;
  onDeleteTeam: (team: Team) => void;
}

export function LoadTeamDialog({
  open,
  teams,
  onClose,
  onLoadTeam,
  onDeleteTeam,
}: LoadTeamDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Load Team</DialogTitle>
      <DialogContent>
        {teams.length === 0 ? (
          <Typography>No saved teams found.</Typography>
        ) : (
          <List>
            {teams.map((savedTeam, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => onLoadTeam(savedTeam)}>
                  <ListItemText primary={savedTeam.name} />
                </ListItemButton>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTeam(savedTeam);
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

