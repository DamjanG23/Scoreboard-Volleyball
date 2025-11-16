import { Box, Typography, Paper } from "@mui/material";

interface TeamColorPickerProps {
  color: string;
  isEditing: boolean;
  onColorChange: (color: string) => void;
}

export function TeamColorPicker({
  color,
  isEditing,
  onColorChange,
}: TeamColorPickerProps) {
  return (
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
          backgroundColor: color || "#ffffff",
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
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        style={{ display: "none" }}
      />
    </Box>
  );
}
