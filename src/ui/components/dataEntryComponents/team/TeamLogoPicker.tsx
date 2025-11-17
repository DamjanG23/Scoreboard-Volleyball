import { Box, Typography, Paper, TextField } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

interface TeamLogoPickerProps {
  logoPath: string;
  logoBase64: string;
  isEditing: boolean;
  onLogoClick: () => void;
}

export function TeamLogoPicker({
  logoPath,
  logoBase64,
  isEditing,
  onLogoClick,
}: TeamLogoPickerProps) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Team Logo
      </Typography>
      <Paper
        elevation={2}
        onClick={() => {
          if (isEditing) {
            onLogoClick();
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
        {logoBase64 ? (
          <Box
            component="img"
            src={logoBase64}
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
      <TextField
        value={logoPath}
        placeholder="Logo path"
        disabled
        size="small"
        sx={{
          mt: 2,
          width: 250,
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      />
    </Box>
  );
}
