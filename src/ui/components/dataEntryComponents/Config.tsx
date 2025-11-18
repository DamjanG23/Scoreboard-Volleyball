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
    loadingLogoPath: matchConfig?.loadingLogoPath ?? "",
    loadingLogoBase64: matchConfig?.loadingLogoBase64 ?? "",
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [backupConfig, setBackupConfig] = useState<MatchConfig | null>(null);

  useEffect(() => {
    if (!isEditing && matchConfig) {
      setFormConfig({
        config: matchConfig.config,
        timeoutDurationSec: matchConfig.timeoutDurationSec,
        intervalBetweenSetsSec: matchConfig.intervalBetweenSetsSec,
        loadingLogoPath: matchConfig.loadingLogoPath ?? "",
        loadingLogoBase64: matchConfig.loadingLogoBase64 ?? "",
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

  const handleSelectLoadingLogo = async () => {
    if (!isEditing) {
      return;
    }

    const selectedPath = await window.electron.selectLogoFile();

    if (!selectedPath) {
      return;
    }

    const base64 = await window.electron.getImageAsBase64(selectedPath);

    setFormConfig((prev) => ({
      ...prev,
      loadingLogoPath: selectedPath,
      loadingLogoBase64: base64 ?? "",
    }));
  };

  const handleRemoveLoadingLogo = () => {
    if (!isEditing) {
      return;
    }

    setFormConfig((prev) => ({
      ...prev,
      loadingLogoPath: "",
      loadingLogoBase64: "",
    }));
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

          <Stack spacing={1}>
            <Typography variant="subtitle1">Loading Logo</Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 180,
                backgroundColor: "#f8f8f8",
              }}
            >
              {formConfig.loadingLogoBase64 ? (
                <img
                  src={formConfig.loadingLogoBase64}
                  alt="Loading Logo Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 160,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography color="text.secondary">No logo selected</Typography>
              )}
            </Paper>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={handleSelectLoadingLogo}
                disabled={!isEditing}
              >
                Select Logo
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={handleRemoveLoadingLogo}
                disabled={!isEditing || !formConfig.loadingLogoPath}
              >
                Remove
              </Button>
            </Stack>
            {formConfig.loadingLogoPath && (
              <Typography variant="caption" color="text.secondary">
                {formConfig.loadingLogoPath}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
