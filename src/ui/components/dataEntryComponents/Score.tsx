import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import { PlayArrow, Stop, Save, Add, Remove } from "@mui/icons-material";

interface ScoreProps {
  currentMatch: Match | null;
}

export function Score({ currentMatch }: ScoreProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);
  const [manualTime, setManualTime] = useState("");
  const [teamAPoints, setTeamAPoints] = useState("");
  const [teamBPoints, setTeamBPoints] = useState("");

  useEffect(() => {
    // Check if time is running when component mounts
    window.electron.isMatchTimeRunning().then(setIsRunning);
    window.electron.isWarmupTimeRunning().then(setIsWarmupRunning);
  }, []);

  // Update local state when currentMatch changes
  useEffect(() => {
    if (currentMatch?.teamAScore) {
      setTeamAPoints(String(currentMatch.teamAScore.points));
    } else {
      setTeamAPoints("0");
    }
    if (currentMatch?.teamBScore) {
      setTeamBPoints(String(currentMatch.teamBScore.points));
    } else {
      setTeamBPoints("0");
    }
  }, [currentMatch]);

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

  const updateTeamAPoints = (points: number) => {
    const score: Score = {
      points,
      sets: currentMatch?.teamAScore?.sets || 0,
      timeouts: currentMatch?.teamAScore?.timeouts || 0,
    };
    window.electron.updateTeamAScore(score);
  };

  const updateTeamBPoints = (points: number) => {
    const score: Score = {
      points,
      sets: currentMatch?.teamBScore?.sets || 0,
      timeouts: currentMatch?.teamBScore?.timeouts || 0,
    };
    window.electron.updateTeamBScore(score);
  };

  const handleTeamAPointsChange = (value: string) => {
    setTeamAPoints(value);
  };

  const handleTeamBPointsChange = (value: string) => {
    setTeamBPoints(value);
  };

  const handleTeamAPointsBlur = () => {
    const points = parseInt(teamAPoints || "0", 10);
    updateTeamAPoints(points);
  };

  const handleTeamBPointsBlur = () => {
    const points = parseInt(teamBPoints || "0", 10);
    updateTeamBPoints(points);
  };

  const handleTeamAPointsKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTeamAPointsBlur();
    }
  };

  const handleTeamBPointsKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTeamBPointsBlur();
    }
  };

  const handleTeamAIncrement = () => {
    const currentPoints = parseInt(teamAPoints || "0", 10);
    updateTeamAPoints(currentPoints + 1);
  };

  const handleTeamADecrement = () => {
    const currentPoints = parseInt(teamAPoints || "0", 10);
    updateTeamAPoints(Math.max(0, currentPoints - 1));
  };

  const handleTeamBIncrement = () => {
    const currentPoints = parseInt(teamBPoints || "0", 10);
    updateTeamBPoints(currentPoints + 1);
  };

  const handleTeamBDecrement = () => {
    const currentPoints = parseInt(teamBPoints || "0", 10);
    updateTeamBPoints(Math.max(0, currentPoints - 1));
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
      <Stack spacing={3}>
        {/* Time Controls */}
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

        {/* Score Controls */}
        <Paper
          elevation={3}
          sx={{ p: 3, maxWidth: 1100, mx: "auto", width: "100%" }}
        >
          <Stack direction="row" spacing={4} justifyContent="space-around">
            {/* Team A Score */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                {currentMatch?.teams?.teamA?.name || "Team A"}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  onClick={handleTeamADecrement}
                  size="large"
                  disabled={!isRunning}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={teamAPoints}
                  onChange={(e) => handleTeamAPointsChange(e.target.value)}
                  onBlur={handleTeamAPointsBlur}
                  onKeyPress={handleTeamAPointsKeyPress}
                  disabled={!isRunning}
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  sx={{ width: 100 }}
                  size="medium"
                />
                <IconButton
                  color="success"
                  onClick={handleTeamAIncrement}
                  size="large"
                  disabled={!isRunning}
                >
                  <Add />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Points
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Team B Score */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                {currentMatch?.teams?.teamB?.name || "Team B"}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  onClick={handleTeamBDecrement}
                  size="large"
                  disabled={!isRunning}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={teamBPoints}
                  onChange={(e) => handleTeamBPointsChange(e.target.value)}
                  onBlur={handleTeamBPointsBlur}
                  onKeyPress={handleTeamBPointsKeyPress}
                  disabled={!isRunning}
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  sx={{ width: 100 }}
                  size="medium"
                />
                <IconButton
                  color="success"
                  onClick={handleTeamBIncrement}
                  size="large"
                  disabled={!isRunning}
                >
                  <Add />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Points
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
