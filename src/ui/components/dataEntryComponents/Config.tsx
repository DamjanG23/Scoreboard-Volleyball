import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";

interface ConfigProps {
  matchConfig: MatchConfig | undefined;
}

export function Config({ matchConfig }: ConfigProps) {
  const [formConfig, setFormConfig] = useState<MatchConfig>(() => ({
    config: matchConfig?.config ?? "",
    timeoutDurationSec: matchConfig?.timeoutDurationSec ?? 30,
    intervalBetweenSetsSec: matchConfig?.intervalBetweenSetsSec ?? 180,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [backupConfig, setBackupConfig] = useState<MatchConfig | null>(null);

  useEffect(() => {
    if (!isEditing && matchConfig) {
      setFormConfig({
        config: matchConfig.config,
        timeoutDurationSec: matchConfig.timeoutDurationSec,
        intervalBetweenSetsSec: matchConfig.intervalBetweenSetsSec,
      });
    }
  }, [matchConfig, isEditing]);

  const handleEditSaveClick = () => {
    if (!isEditing) {
      setBackupConfig(formConfig);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setBackupConfig(null);
      window.electron.saveConfig(formConfig);
      console.log("Saving config:", formConfig);
    }
  };

  const handleCancelClick = () => {
    if (backupConfig) {
      setFormConfig(backupConfig);
    }
    setIsEditing(false);
    setBackupConfig(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
          Match Configuration
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
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
        </Stack>

        <Stack spacing={3}>
          <TextField
            label="Timeout Duration (seconds)"
            type="number"
            value={formConfig.timeoutDurationSec}
            onChange={(e) =>
              setFormConfig((prev) => ({
                ...prev,
                timeoutDurationSec: parseInt(e.target.value) || 0,
              }))
            }
            disabled={!isEditing}
            fullWidth
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Interval Between Sets (seconds)"
            type="number"
            value={formConfig.intervalBetweenSetsSec}
            onChange={(e) =>
              setFormConfig((prev) => ({
                ...prev,
                intervalBetweenSetsSec: parseInt(e.target.value) || 0,
              }))
            }
            disabled={!isEditing}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
