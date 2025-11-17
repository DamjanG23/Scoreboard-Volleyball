import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { PlayArrow, Stop, Save } from "@mui/icons-material";

interface ScoreProps {
  currentMatch: Match | null;
}

export function Score({ currentMatch }: ScoreProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);
  const [manualTime, setManualTime] = useState("");

  useEffect(() => {
    // Check if time is running when component mounts
    window.electron.isMatchTimeRunning().then(setIsRunning);
    window.electron.isWarmupTimeRunning().then(setIsWarmupRunning);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const parseTime = (timeString: string): number => {
    const parts = timeString.split(":").map((p) => parseInt(p || "0", 10));
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    }
    return 0;
  };

  const handleStartStop = async () => {
    if (isRunning) {
      window.electron.stopMatchTime();
      setIsRunning(false);
    } else {
      window.electron.startMatchTime();
      setIsRunning(true);
    }
  };

  const handleWarmupStartStop = async () => {
    if (isWarmupRunning) {
      window.electron.stopWarmupTime();
      setIsWarmupRunning(false);
    } else {
      window.electron.startWarmupTime();
      setIsWarmupRunning(true);
    }
  };

  const handleSaveManualTime = () => {
    const newTimeSec = parseTime(manualTime);
    window.electron.updateMatchTime(newTimeSec);
    setManualTime("");
  };

  const currentTimeSec = currentMatch?.timeSec || 0;

  if (!currentMatch) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <Typography variant="h4" color="text.secondary">
          Please Load/Start a Match!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Start/Stop Button */}
          <Button
            variant="contained"
            size="large"
            color={isRunning ? "warning" : "error"}
            startIcon={isRunning ? <Stop /> : <PlayArrow />}
            onClick={handleStartStop}
            disabled={isWarmupRunning}
            sx={{ minWidth: 160 }}
          >
            {isRunning ? "Stop Time" : "Start Time"}
          </Button>

          {/* Start/Stop Warmup Button */}
          <Button
            variant="contained"
            size="large"
            color={isWarmupRunning ? "warning" : "info"}
            startIcon={isWarmupRunning ? <Stop /> : <PlayArrow />}
            onClick={handleWarmupStartStop}
            disabled={isRunning}
            sx={{ minWidth: 180 }}
          >
            {isWarmupRunning ? "Stop Warmup" : "Start Warmup"}
          </Button>

          {/* Display Current Time */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: "monospace",
              fontWeight: "bold",
              color: isRunning
                ? "success.main"
                : isWarmupRunning
                ? "info.main"
                : "text.primary",
              minWidth: 180,
            }}
          >
            {formatTime(currentTimeSec)}
          </Typography>

          {/* Manual Time Input (only when stopped) */}
          {!isRunning && !isWarmupRunning ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="HH:MM:SS"
                variant="outlined"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                placeholder="00:00:00"
                size="small"
                sx={{ width: 140 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSaveManualTime}
                disabled={!manualTime}
              >
                Save
              </Button>
            </Stack>
          ) : (
            <Box sx={{ width: 230 }} />
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
