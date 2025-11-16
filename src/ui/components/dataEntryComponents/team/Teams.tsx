import { TeamsInput } from "./TeamInput";
import { Box, Typography, Paper, Divider } from "@mui/material";

interface TeamsProps {
  matchTeams: MatchTeams | undefined;
}

export function Teams({ matchTeams }: TeamsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        gap: 2,
        p: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            HOME TEAM
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TeamsInput team={matchTeams?.teamA} isTeamHome={true} />
        </Paper>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            AWAY TEAM
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TeamsInput team={matchTeams?.teamB} isTeamHome={false} />
        </Paper>
      </Box>
    </Box>
  );
}
