import { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { TeamControls } from "./TeamControls";
import { TeamBasicInfo } from "./TeamBasicInfo";
import { PlayersList } from "./PlayersList";
import { TeamColorPicker } from "./TeamColorPicker";
import { TeamLogoPicker } from "./TeamLogoPicker";
import { NewTeamDialog } from "./NewTeamDialog";
import { LoadTeamDialog } from "./LoadTeamDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { ensure14Players } from "./utils";

interface TeamsInputProps {
  team: Team | undefined;
  isTeamHome: boolean;
}

export function TeamsInput({ team, isTeamHome }: TeamsInputProps) {
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
  const [logoBase64, setLogoBase64] = useState<string>("");

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

  // Load logo as base64 when logoPath changes
  useEffect(() => {
    const loadLogo = async () => {
      if (formTeam.logoPath) {
        try {
          const base64 = await window.electron.getImageAsBase64(
            formTeam.logoPath
          );
          if (base64) {
            setLogoBase64(base64);
          } else {
            setLogoBase64("");
          }
        } catch (error) {
          console.error("Error loading logo:", error);
          setLogoBase64("");
        }
      } else {
        setLogoBase64("");
      }
    };

    loadLogo();
  }, [formTeam.logoPath]);

  const loadSavedTeams = async () => {
    try {
      const teams = await window.electron.getTeams();
      setSavedTeams(teams);
    } catch (error) {
      console.error("Failed to load teams:", error);
      setSavedTeams([]);
    }
  };

  const handleEditSaveClick = () => {
    if (!isEditing) {
      setBackupTeam(formTeam);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setBackupTeam(null);
      if (isTeamHome) {
        window.electron.saveTeamA(formTeam);
      } else {
        window.electron.saveTeamB(formTeam);
      }
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
    setIsEditing(true);
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

    // Remove team from current match in backend
    if (isTeamHome) {
      window.electron.removeTeamA();
    } else {
      window.electron.removeTeamB();
    }

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
      window.electron.deleteTeam(teamToDelete.name);
      // Refresh the teams list after deletion
      await loadSavedTeams();
    }
    setIsDeleteConfirmDialogOpen(false);
    setTeamToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmDialogOpen(false);
    setTeamToDelete(null);
  };

  const handleLogoClick = async () => {
    try {
      const logoPath = await window.electron.selectLogoFile();
      if (logoPath) {
        setFormTeam((prev) => ({ ...prev, logoPath }));
        console.log("Logo selected:", logoPath);
      } else {
        console.log("Logo selection cancelled");
      }
    } catch (error) {
      console.error("Error selecting logo:", error);
    }
  };

  const handlePlayerChange = (index: number, player: Player) => {
    setFormTeam((prev) => {
      const players = [...prev.players];
      players[index] = player;
      return { ...prev, players };
    });
  };

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <TeamControls
        isTeamActive={isTeamActive}
        isEditing={isEditing}
        onNewClick={() => setIsNewTeamDialogOpen(true)}
        onLoadClick={() => setIsLoadTeamDialogOpen(true)}
        onEditSaveClick={handleEditSaveClick}
        onCancelClick={handleCancelClick}
        onUnloadClick={handleUnloadTeam}
      />

      {isTeamActive && (
        <>
          <TeamBasicInfo
            teamName={formTeam.name}
            coach={formTeam.coach}
            isEditing={isEditing}
            onCoachChange={(value) =>
              setFormTeam((prev) => ({ ...prev, coach: value }))
            }
          />

          <PlayersList
            players={formTeam.players}
            isEditing={isEditing}
            onPlayerChange={handlePlayerChange}
          />

          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            sx={{ mt: 4, flexWrap: "wrap" }}
          >
            <TeamColorPicker
              color={formTeam.color}
              isEditing={isEditing}
              onColorChange={(color) =>
                setFormTeam((prev) => ({ ...prev, color }))
              }
            />

            <TeamLogoPicker
              logoPath={formTeam.logoPath}
              logoBase64={logoBase64}
              isEditing={isEditing}
              onLogoClick={handleLogoClick}
            />
          </Stack>
        </>
      )}

      <NewTeamDialog
        open={isNewTeamDialogOpen}
        teamName={newTeamName}
        onTeamNameChange={setNewTeamName}
        onClose={() => setIsNewTeamDialogOpen(false)}
        onCreate={handleCreateNewTeam}
      />

      <LoadTeamDialog
        open={isLoadTeamDialogOpen}
        teams={savedTeams}
        onClose={() => setIsLoadTeamDialogOpen(false)}
        onLoadTeam={handleLoadTeam}
        onDeleteTeam={handleDeleteClick}
      />

      <DeleteTeamDialog
        open={isDeleteConfirmDialogOpen}
        teamName={teamToDelete?.name}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
