import { Stack, TextField } from "@mui/material";

interface TeamBasicInfoProps {
  teamName: string;
  coach: string;
  isEditing: boolean;
  onCoachChange: (value: string) => void;
}

export function TeamBasicInfo({
  teamName,
  coach,
  isEditing,
  onCoachChange,
}: TeamBasicInfoProps) {
  return (
    <Stack spacing={2} sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
      <TextField
        label="Team Name"
        variant="outlined"
        fullWidth
        value={teamName}
        disabled={true}
      />

      <TextField
        label="Coach"
        variant="outlined"
        fullWidth
        value={coach}
        disabled={!isEditing}
        onChange={(e) => onCoachChange(e.target.value)}
      />
    </Stack>
  );
}
