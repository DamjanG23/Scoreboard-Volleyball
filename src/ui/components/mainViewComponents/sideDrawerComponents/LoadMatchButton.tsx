import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";

export function LoadMatchButton() {
  const [isLoadMatchDialogOpen, setIsLoadMatchDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);

  // Load matches when dialog opens
  useEffect(() => {
    if (isLoadMatchDialogOpen) {
      loadMatches();
    }
  }, [isLoadMatchDialogOpen]);

  const loadMatches = async () => {
    try {
      const matchList = await window.electron.getMatches();
      setMatches(matchList);
    } catch (error) {
      console.error("Failed to load matches:", error);
      setMatches([]);
    }
  };

  const handleLoadMatch = (match: Match) => {
    console.log(
      `Match selected on dialog -> Loading match: "${match.matchName}"`
    );
    window.electron.loadMatch(match.id);
    setIsLoadMatchDialogOpen(false);
  };

  const handleDeleteClick = (match: Match) => {
    setMatchToDelete(match);
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (matchToDelete) {
      console.log(`Deleting match: "${matchToDelete.matchName}"`);
      try {
        await window.electron.deleteMatch(matchToDelete.id);
        // Refresh the matches list after deletion
        loadMatches();
      } catch (error) {
        console.error("Failed to delete match:", error);
      }
    }
    setIsDeleteConfirmDialogOpen(false);
    setMatchToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmDialogOpen(false);
    setMatchToDelete(null);
  };

  return (
    <>
      <Button onClick={() => setIsLoadMatchDialogOpen(true)}>Load Match</Button>

      {/* Load Match Dialog */}
      <Dialog
        open={isLoadMatchDialogOpen}
        onClose={() => setIsLoadMatchDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Load Match</DialogTitle>
        <DialogContent>
          {matches.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            <List>
              {matches.map((match) => (
                <ListItem key={match.id} disablePadding>
                  <ListItemButton onClick={() => handleLoadMatch(match)}>
                    <ListItemText primary={match.matchName} />
                  </ListItemButton>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(match);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLoadMatchDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Match</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the match "{matchToDelete?.matchName}
          "? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
