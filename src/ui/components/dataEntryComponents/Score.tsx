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
import {
  PlayArrow,
  Stop,
  Save,
  Add,
  Remove,
  Delete,
} from "@mui/icons-material";

interface ScoreProps {
  currentMatch: Match | null;
}

export function Score({ currentMatch }: ScoreProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [manualTime, setManualTime] = useState("");
  const [teamAPoints, setTeamAPoints] = useState("");
  const [teamBPoints, setTeamBPoints] = useState("");
  const [teamASets, setTeamASets] = useState(0);
  const [teamBSets, setTeamBSets] = useState(0);
  const [teamATimeouts, setTeamATimeouts] = useState(0);
  const [teamBTimeouts, setTeamBTimeouts] = useState(0);
  const [setHistory, setSetHistory] = useState<
    Array<{
      setNum: number;
      teamAPoints: number;
      teamBPoints: number;
      timeSec: number;
    }>
  >([]);

  useEffect(() => {
    // Check if time is running when component mounts
    window.electron.isMatchTimeRunning().then(setIsRunning);
    window.electron.isWarmupTimeRunning().then(setIsWarmupRunning);
    window.electron.isTimeoutRunning().then(setIsTimeoutRunning);
    window.electron.isRestRunning().then(setIsRestRunning);
  }, []);

  // Subscribe to timeout events
  useEffect(() => {
    const unsubscribeUpdate = window.electron.onTimeoutUpdate(() => {
      // Update timeout running state
      window.electron.isTimeoutRunning().then(setIsTimeoutRunning);
    });

    const unsubscribeEnded = window.electron.onTimeoutEnded(() => {
      setIsTimeoutRunning(false);
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeEnded();
    };
  }, []);

  // Subscribe to rest events
  useEffect(() => {
    const unsubscribeUpdate = window.electron.onRestUpdate(() => {
      // Update rest running state
      window.electron.isRestRunning().then(setIsRestRunning);
    });

    const unsubscribeEnded = window.electron.onRestEnded(() => {
      setIsRestRunning(false);
    });

    return () => {
      unsubscribeUpdate();
      unsubscribeEnded();
    };
  }, []);

  // Update local state when currentMatch changes
  useEffect(() => {
    if (currentMatch?.teamAScore) {
      setTeamAPoints(String(currentMatch.teamAScore.points));
      setTeamASets(currentMatch.teamAScore.sets || 0);
      setTeamATimeouts(currentMatch.teamAScore.timeouts || 0);
    } else {
      setTeamAPoints("0");
      setTeamASets(0);
      setTeamATimeouts(0);
    }
    if (currentMatch?.teamBScore) {
      setTeamBPoints(String(currentMatch.teamBScore.points));
      setTeamBSets(currentMatch.teamBScore.sets || 0);
      setTeamBTimeouts(currentMatch.teamBScore.timeouts || 0);
    } else {
      setTeamBPoints("0");
      setTeamBSets(0);
      setTeamBTimeouts(0);
    }
    // Update set history
    setSetHistory(currentMatch?.setHistory || []);
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

  // Sets handlers
  const handleTeamAIncrementSets = () => {
    window.electron.incrementTeamASets();
  };

  const handleTeamADecrementSets = () => {
    window.electron.decrementTeamASets();
  };

  const handleTeamBIncrementSets = () => {
    window.electron.incrementTeamBSets();
  };

  const handleTeamBDecrementSets = () => {
    window.electron.decrementTeamBSets();
  };

  // Timeouts handlers
  const handleTeamAIncrementTimeouts = () => {
    window.electron.incrementTeamATimeouts();
  };

  const handleTeamADecrementTimeouts = () => {
    window.electron.decrementTeamATimeouts();
  };

  const handleTeamBIncrementTimeouts = () => {
    window.electron.incrementTeamBTimeouts();
  };

  const handleTeamBDecrementTimeouts = () => {
    window.electron.decrementTeamBTimeouts();
  };

  // Cancel timeout handler
  const handleCancelTimeout = () => {
    window.electron.stopTimeout();
  };

  // Cancel rest handler
  const handleCancelRest = () => {
    window.electron.stopRest();
  };

  // Set history handlers
  const handleAddSet = () => {
    if (setHistory.length >= 5) return;

    // Find the next available set number (1-5)
    const existingSetNums = new Set(setHistory.map((s) => s.setNum));
    let nextSetNum = 1;
    for (let i = 1; i <= 5; i++) {
      if (!existingSetNums.has(i)) {
        nextSetNum = i;
        break;
      }
    }

    const newSet = {
      setNum: nextSetNum,
      teamAPoints: 0,
      teamBPoints: 0,
      timeSec: 0,
    };

    // Insert in order by setNum
    const updatedHistory = [...setHistory, newSet].sort(
      (a, b) => a.setNum - b.setNum
    );
    setSetHistory(updatedHistory);
    window.electron.updateSetHistory(updatedHistory);
  };

  const handleRemoveSet = (index: number) => {
    // Remove the set without renumbering (keep original set numbers)
    const updatedHistory = setHistory.filter((_, i) => i !== index);
    setSetHistory(updatedHistory);
    window.electron.updateSetHistory(updatedHistory);
  };

  const handleSetFieldChange = (
    index: number,
    field: "teamAPoints" | "teamBPoints" | "timeSec",
    value: number
  ) => {
    const updatedHistory = [...setHistory];
    updatedHistory[index] = {
      ...updatedHistory[index],
      [field]: value,
    };
    setSetHistory(updatedHistory);
  };

  const handleSetFieldBlur = () => {
    window.electron.updateSetHistory(setHistory);
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

        {/* Cancel Timeout Button */}
        {isTimeoutRunning && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleCancelTimeout}
              sx={{ minWidth: 200 }}
            >
              Cancel Timeout
            </Button>
          </Box>
        )}

        {/* Cancel Rest Button */}
        {isRestRunning && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleCancelRest}
              sx={{ minWidth: 200 }}
            >
              Cancel Rest Period
            </Button>
          </Box>
        )}

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

        {/* Sets Controls */}
        <Paper
          elevation={3}
          sx={{ p: 3, maxWidth: 1100, mx: "auto", width: "100%" }}
        >
          <Stack direction="row" spacing={4} justifyContent="space-around">
            {/* Team A Sets */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  onClick={handleTeamADecrementSets}
                  size="large"
                  disabled={!isRunning}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={teamASets}
                  disabled
                  inputProps={{
                    min: 0,
                    max: 3,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 100 }}
                  size="medium"
                />
                <IconButton
                  color="success"
                  onClick={handleTeamAIncrementSets}
                  size="large"
                  disabled={!isRunning}
                >
                  <Add />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Sets
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Team B Sets */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  onClick={handleTeamBDecrementSets}
                  size="large"
                  disabled={!isRunning}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={teamBSets}
                  disabled
                  inputProps={{
                    min: 0,
                    max: 3,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 100 }}
                  size="medium"
                />
                <IconButton
                  color="success"
                  onClick={handleTeamBIncrementSets}
                  size="large"
                  disabled={!isRunning}
                >
                  <Add />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Sets
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Timeouts Controls */}
        <Paper
          elevation={3}
          sx={{ p: 3, maxWidth: 1100, mx: "auto", width: "100%" }}
        >
          <Stack direction="row" spacing={4} justifyContent="space-around">
            {/* Team A Timeouts */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  onClick={handleTeamADecrementTimeouts}
                  size="large"
                  disabled={!isRunning}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={teamATimeouts}
                  disabled
                  inputProps={{
                    min: 0,
                    max: 2,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 100 }}
                  size="medium"
                />
                <IconButton
                  color="success"
                  onClick={handleTeamAIncrementTimeouts}
                  size="large"
                  disabled={!isRunning}
                >
                  <Add />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Timeouts
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Team B Timeouts */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  color="error"
                  onClick={handleTeamBDecrementTimeouts}
                  size="large"
                  disabled={!isRunning}
                >
                  <Remove />
                </IconButton>
                <TextField
                  type="number"
                  value={teamBTimeouts}
                  disabled
                  inputProps={{
                    min: 0,
                    max: 2,
                    style: { textAlign: "center" },
                  }}
                  sx={{ width: 100 }}
                  size="medium"
                />
                <IconButton
                  color="success"
                  onClick={handleTeamBIncrementTimeouts}
                  size="large"
                  disabled={!isRunning}
                >
                  <Add />
                </IconButton>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Timeouts
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Set History Controls */}
        <Paper
          elevation={3}
          sx={{ p: 3, maxWidth: 1100, mx: "auto", width: "100%" }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Set History</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddSet}
                disabled={setHistory.length >= 5}
                size="small"
              >
                Add Set
              </Button>
            </Box>

            {setHistory.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                No sets recorded yet
              </Typography>
            ) : (
              <Stack spacing={2}>
                {setHistory.map((set, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body1" sx={{ minWidth: 60 }}>
                        Set {set.setNum}
                      </Typography>

                      <TextField
                        label="Team A Points"
                        type="number"
                        value={set.teamAPoints}
                        onChange={(e) =>
                          handleSetFieldChange(
                            index,
                            "teamAPoints",
                            parseInt(e.target.value) || 0
                          )
                        }
                        onBlur={handleSetFieldBlur}
                        size="small"
                        sx={{ width: 140 }}
                        inputProps={{ min: 0 }}
                      />

                      <TextField
                        label="Team B Points"
                        type="number"
                        value={set.teamBPoints}
                        onChange={(e) =>
                          handleSetFieldChange(
                            index,
                            "teamBPoints",
                            parseInt(e.target.value) || 0
                          )
                        }
                        onBlur={handleSetFieldBlur}
                        size="small"
                        sx={{ width: 140 }}
                        inputProps={{ min: 0 }}
                      />

                      <TextField
                        label="Duration (sec)"
                        type="number"
                        value={set.timeSec}
                        onChange={(e) =>
                          handleSetFieldChange(
                            index,
                            "timeSec",
                            parseInt(e.target.value) || 0
                          )
                        }
                        onBlur={handleSetFieldBlur}
                        size="small"
                        sx={{ width: 140 }}
                        inputProps={{ min: 0 }}
                      />

                      <IconButton
                        color="error"
                        onClick={() => handleRemoveSet(index)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
