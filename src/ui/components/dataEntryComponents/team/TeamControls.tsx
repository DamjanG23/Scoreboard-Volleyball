import { Stack, Button, IconButton } from "@mui/material";
import { Edit, Save, Download, Close, Add } from "@mui/icons-material";

interface TeamControlsProps {
  isTeamActive: boolean;
  isEditing: boolean;
  onNewClick: () => void;
  onLoadClick: () => void;
  onEditSaveClick: () => void;
  onCancelClick: () => void;
  onUnloadClick: () => void;
}

export function TeamControls({
  isTeamActive,
  isEditing,
  onNewClick,
  onLoadClick,
  onEditSaveClick,
  onCancelClick,
  onUnloadClick,
}: TeamControlsProps) {
  return (
    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={onNewClick}
        disabled={isTeamActive}
      >
        New
      </Button>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={onLoadClick}
        disabled={isTeamActive}
      >
        Load
      </Button>
      {isTeamActive && (
        <>
          <Button
            variant={isEditing ? "contained" : "outlined"}
            startIcon={isEditing ? <Save /> : <Edit />}
            onClick={onEditSaveClick}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          {isEditing && (
            <Button variant="outlined" color="error" onClick={onCancelClick}>
              Cancel
            </Button>
          )}
          <IconButton
            color="error"
            onClick={onUnloadClick}
            sx={{ border: 1, borderColor: "error.main" }}
          >
            <Close />
          </IconButton>
        </>
      )}
    </Stack>
  );
}

