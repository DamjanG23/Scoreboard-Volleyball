import { Box, Typography, Paper, Stack, TextField } from "@mui/material";

interface PlayersListProps {
  players: Player[];
  isEditing: boolean;
  onPlayerChange: (index: number, player: Player) => void;
}

export function PlayersList({
  players,
  isEditing,
  onPlayerChange,
}: PlayersListProps) {
  return (
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
          {players.map((player, index) => (
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
                  onPlayerChange(index, { ...player, number: num });
                }}
                size="small"
              />

              <TextField
                fullWidth
                placeholder={`Player ${index + 1} name`}
                value={player.name}
                disabled={!isEditing}
                onChange={(e) =>
                  onPlayerChange(index, { ...player, name: e.target.value })
                }
                size="small"
              />
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

