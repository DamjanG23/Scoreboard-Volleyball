import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Edit,
  Save,
  Download,
  Close,
  CloudUpload,
  Delete,
  Add,
} from "@mui/icons-material";

interface TeamsInputProps {
  team: Team | undefined;
}

const ensure14Players = (players?: Player[]): Player[] => {
  const base = players ? [...players] : [];
  while (base.length < 14) {
    base.push({ number: base.length + 1, name: "" });
  }
  return base.slice(0, 14);
};

// TODO: Replace with actual saved teams from backend
const mockSavedTeams: Team[] = [
  {
    name: "Team Alpha",
    coach: "Coach Smith",
    logoPath: "",
    color: "#ff5722",
    players: ensure14Players([
      { number: 1, name: "John Doe" },
      { number: 2, name: "Jane Smith" },
    ]),
  },
  {
    name: "Team Beta",
    coach: "Coach Johnson",
    logoPath: "",
    color: "#2196f3",
    players: ensure14Players([
      { number: 1, name: "Alice Brown" },
      { number: 2, name: "Bob Wilson" },
    ]),
  },
  {
    name: "Team Gamma",
    coach: "Coach Williams",
    logoPath: "",
    color: "#4caf50",
    players: ensure14Players([
      { number: 1, name: "Charlie Davis" },
      { number: 2, name: "Diana Martinez" },
    ]),
  },
];

export function TeamsInput({ team }: TeamsInputProps) {
  const [formTeam, setFormTeam] = useState<Team>(() => ({
    name: team?.name ?? "",
    coach: team?.coach ?? "",
    logoPath: team?.logoPath ?? "",
    color: team?.color ?? "#ffffff",
    players: ensure14Players(team?.players),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [backupTeam, setBackupTeam] = useState<Team | null>(null);
  const [isLoadTeamDialogOpen, setIsLoadTeamDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState(false);
  const [savedTeams, setSavedTeams] = useState<Team[]>([]);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [isTeamActive, setIsTeamActive] = useState(!!team);

  useEffect(() => {
    if (!isEditing) {
      if (team) {
        setFormTeam({
          name: team.name,
          coach: team.coach,
          logoPath: team.logoPath,
          color: team.color,
          players: ensure14Players(team.players),
        });
        setIsTeamActive(true);
      } else {
        setFormTeam({
          name: "",
          coach: "",
          logoPath: "",
          color: "#ffffff",
          players: ensure14Players(undefined),
        });
        setIsTeamActive(false);
      }
    }
  }, [team, isEditing]);

  // Load saved teams when dialog opens
  useEffect(() => {
    if (isLoadTeamDialogOpen) {
      loadSavedTeams();
    }
  }, [isLoadTeamDialogOpen]);

  const loadSavedTeams = async () => {
    // TODO: Replace with actual backend call
    // Example: const teams = await window.electron.getSavedTeams();
    setSavedTeams(mockSavedTeams);
  };

  const handleEditSaveClick = () => {
    if (!isEditing) {
      setBackupTeam(formTeam);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setBackupTeam(null);
      //TODO: implement a save to back end
      console.log("Saving team:", formTeam);
    }
  };

  const handleCancelClick = () => {
    if (backupTeam) {
      setFormTeam(backupTeam);
    }
    setIsEditing(false);
    setBackupTeam(null);
  };

  const handleLoadTeam = (selectedTeam: Team) => {
    console.log(`Loading team: "${selectedTeam.name}"`);
    // TODO: Integrate with backend if needed
    setFormTeam(selectedTeam);
    setIsTeamActive(true);
    setIsLoadTeamDialogOpen(false);
  };

  const handleCreateNewTeam = () => {
    console.log(`Creating new team: "${newTeamName}"`);
    setFormTeam({
      name: newTeamName,
      coach: "",
      logoPath: "",
      color: "#ffffff",
      players: ensure14Players(undefined),
    });
    setIsTeamActive(true);
    setIsEditing(true);
    setIsNewTeamDialogOpen(false);
    setNewTeamName("");
  };

  const handleUnloadTeam = () => {
    console.log("Unloading team");
    setFormTeam({
      name: "",
      coach: "",
      logoPath: "",
      color: "#ffffff",
      players: ensure14Players(undefined),
    });
    setIsTeamActive(false);
    setIsEditing(false);
    setBackupTeam(null);
  };

  const handleDeleteClick = (selectedTeam: Team) => {
    setTeamToDelete(selectedTeam);
    setIsDeleteConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (teamToDelete) {
      console.log(`Deleting team: "${teamToDelete.name}"`);
      // TODO: Replace with actual backend call
      // Example: await window.electron.deleteTeam(teamToDelete.id);
      // Refresh the teams list after deletion
      loadSavedTeams();
    }
    setIsDeleteConfirmDialogOpen(false);
    setTeamToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmDialogOpen(false);
    setTeamToDelete(null);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      {/* BUTTONS */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setIsNewTeamDialogOpen(true)}
          disabled={isTeamActive}
        >
          New
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={() => setIsLoadTeamDialogOpen(true)}
          disabled={isTeamActive}
        >
          Load
        </Button>
        {isTeamActive && (
          <>
            <Button
              variant={isEditing ? "contained" : "outlined"}
              startIcon={isEditing ? <Save /> : <Edit />}
              onClick={handleEditSaveClick}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
            {isEditing && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            )}
            <IconButton
              color="error"
              onClick={handleUnloadTeam}
              sx={{ border: 1, borderColor: "error.main" }}
            >
              <Close />
            </IconButton>
          </>
        )}
      </Stack>

      {isTeamActive && (
        <>
          {/* TEAM NAME & COACH */}
          <Stack spacing={2} sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
            <TextField
              label="Team Name"
              variant="outlined"
              fullWidth
              value={formTeam.name}
              disabled={true}
            />

            <TextField
              label="Coach"
              variant="outlined"
              fullWidth
              value={formTeam.coach}
              disabled={!isEditing}
              onChange={(e) =>
                setFormTeam((prev) => ({ ...prev, coach: e.target.value }))
              }
            />
          </Stack>

          {/* PLAYERS */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Players
            </Typography>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: 500,
                mx: "auto",
                maxHeight: 400,
                overflow: "auto",
              }}
            >
              <Stack spacing={1}>
                {formTeam.players.map((player, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TextField
                      type="number"
                      inputProps={{ min: 1 }}
                      value={player.number}
                      disabled={!isEditing}
                      sx={{ width: 80 }}
                      onChange={(e) => {
                        const num = parseInt(e.target.value || "0", 10);
                        setFormTeam((prev) => {
                          const players = [...prev.players];
                          players[index] = { ...players[index], number: num };
                          return { ...prev, players };
                        });
                      }}
                      size="small"
                    />

                    <TextField
                      fullWidth
                      placeholder={`Player ${index + 1} name`}
                      value={player.name}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setFormTeam((prev) => {
                          const players = [...prev.players];
                          players[index] = {
                            ...players[index],
                            name: e.target.value,
                          };
                          return { ...prev, players };
                        })
                      }
                      size="small"
                    />
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* COLOR + LOGO SECTION */}
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            sx={{ mt: 4, flexWrap: "wrap" }}
          >
            {/* COLOR PICKER + PREVIEW */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Team Color
              </Typography>
              <Paper
                elevation={2}
                onClick={() => {
                  if (isEditing) {
                    document.getElementById("color-picker-input")?.click();
                  }
                }}
                sx={{
                  width: 150,
                  height: 150,
                  mx: "auto",
                  backgroundColor: formTeam.color || "#ffffff",
                  cursor: isEditing ? "pointer" : "default",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": isEditing
                    ? {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      }
                    : {},
                }}
              />
              <input
                id="color-picker-input"
                type="color"
                disabled={!isEditing}
                value={formTeam.color}
                onChange={(e) =>
                  setFormTeam((prev) => ({ ...prev, color: e.target.value }))
                }
                style={{ display: "none" }}
              />
            </Box>

            {/* LOGO PICKER */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Team Logo
              </Typography>
              <Paper
                elevation={2}
                onClick={() => {
                  if (isEditing) {
                    // TODO: Implement logo selection logic
                    console.log(
                      "Logo clicked - implement file picker logic here"
                    );
                  }
                }}
                sx={{
                  width: 150,
                  height: 150,
                  mx: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  backgroundColor: "grey.100",
                  cursor: isEditing ? "pointer" : "default",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": isEditing
                    ? {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      }
                    : {},
                }}
              >
                {formTeam.logoPath ? (
                  <Box
                    component="img"
                    src={formTeam.logoPath}
                    alt="Team logo"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <>
                    <CloudUpload
                      sx={{ fontSize: 48, color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Click to upload
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          </Stack>
        </>
      )}

      {/* Load Team Dialog */}
      <Dialog
        open={isLoadTeamDialogOpen}
        onClose={() => setIsLoadTeamDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Load Team</DialogTitle>
        <DialogContent>
          {savedTeams.length === 0 ? (
            <Typography>No saved teams found.</Typography>
          ) : (
            <List>
              {savedTeams.map((savedTeam, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => handleLoadTeam(savedTeam)}>
                    <ListItemText primary={savedTeam.name} />
                  </ListItemButton>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(savedTeam);
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
          <Button onClick={() => setIsLoadTeamDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the team "{teamToDelete?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Team Dialog */}
      <Dialog
        open={isNewTeamDialogOpen}
        onClose={() => setIsNewTeamDialogOpen(false)}
      >
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            variant="outlined"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewTeamDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateNewTeam}
            disabled={newTeamName.trim().length === 0}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
