import { useState, useEffect } from "react";

interface ScoreboardViewProps {
  currentMatch: Match | null;
}

export default function ScoreboardView({ currentMatch }: ScoreboardViewProps) {
  const [isFilled, setIsFilled] = useState(false);
  const [teamALogoBase64, setTeamALogoBase64] = useState<string>("");
  const [teamBLogoBase64, setTeamBLogoBase64] = useState<string>("");
  const [colonVisible, setColonVisible] = useState(true);
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const [isWarmupRunning, setIsWarmupRunning] = useState(false);

  useEffect(() => {
    window.electron.getScoreboardFillState().then(setIsFilled);
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.onScoreboardFillStateChange(
      (fillState) => {
        setIsFilled(fillState);
      }
    );

    return unsubscribe;
  }, []);

  const teamA = currentMatch?.teams?.teamA;
  const teamB = currentMatch?.teams?.teamB;

  // Load Team A logo as base64
  useEffect(() => {
    const loadTeamALogo = async () => {
      if (teamA?.logoPath) {
        try {
          const base64 = await window.electron.getImageAsBase64(teamA.logoPath);
          if (base64) {
            setTeamALogoBase64(base64);
          } else {
            setTeamALogoBase64("");
          }
        } catch (error) {
          console.error("Error loading Team A logo:", error);
          setTeamALogoBase64("");
        }
      } else {
        setTeamALogoBase64("");
      }
    };

    loadTeamALogo();
  }, [teamA?.logoPath]);

  // Load Team B logo as base64
  useEffect(() => {
    const loadTeamBLogo = async () => {
      if (teamB?.logoPath) {
        try {
          const base64 = await window.electron.getImageAsBase64(teamB.logoPath);
          if (base64) {
            setTeamBLogoBase64(base64);
          } else {
            setTeamBLogoBase64("");
          }
        } catch (error) {
          console.error("Error loading Team B logo:", error);
          setTeamBLogoBase64("");
        }
      } else {
        setTeamBLogoBase64("");
      }
    };

    loadTeamBLogo();
  }, [teamB?.logoPath]);
  const teamAScore = currentMatch?.teamAScore || {
    points: 0,
    sets: 0,
    timeouts: 0,
  };
  const teamBScore = currentMatch?.teamBScore || {
    points: 0,
    sets: 0,
    timeouts: 0,
  };
  const setHistory = currentMatch?.setHistory || [];
  const timeSec = currentMatch?.timeSec || 0;

  // Calculate current set number (total sets played + 1)
  const currentSetNum = (teamAScore.sets || 0) + (teamBScore.sets || 0) + 1;

  // Check if time is running
  useEffect(() => {
    const checkTimeRunning = async () => {
      const running = await window.electron.isMatchTimeRunning();
      setIsTimeRunning(running);
    };

    checkTimeRunning();
    const interval = setInterval(checkTimeRunning, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if warmup is running
  useEffect(() => {
    const checkWarmupRunning = async () => {
      const running = await window.electron.isWarmupTimeRunning();
      setIsWarmupRunning(running);
    };

    checkWarmupRunning();
    const interval = setInterval(checkWarmupRunning, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulse colon every 2 seconds when time is running (blink for 100ms)
  useEffect(() => {
    if (!isTimeRunning && !isWarmupRunning) {
      setColonVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setColonVisible(false);
      setTimeout(() => {
        setColonVisible(true);
      }, 100);
    }, 2000);

    return () => clearInterval(interval);
  }, [isTimeRunning, isWarmupRunning]);

  // Format time as HH:MM
  const formatTimeHHMM = (
    seconds: number
  ): { hours: string; minutes: string } => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
    };
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // Format time as MM:SS for set history
  const formatSetTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // If not filled, show only the desktop icon
  if (!isFilled) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f0f0f",
        }}
      >
        <img
          src="/desktopIcon.png"
          alt="Logo"
          style={{
            maxWidth: "50vw",
            maxHeight: "50vh",
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "#0f0f0f",
        color: "#fff",
        fontFamily: "'Jersey 10', sans-serif",
        fontWeight: "normal",
        overflow: "hidden",
      }}
    >
      {/* Team A Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: teamA?.color || "#1976d2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isWarmupRunning ? (
          /* Warmup View - Player List */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1vh",
              padding: "3vh 2vh",
            }}
          >
            {(teamA?.players || []).slice(0, 14).map((player, index) => (
              <div
                key={index}
                style={{
                  fontSize: "3vw",
                  fontWeight: "normal",
                  backgroundColor: "#0f0f0f",
                  padding: "1vh 1.5vw",
                  borderRadius: 0,
                  letterSpacing: "0.08em",
                  width: "85%",
                  boxSizing: "border-box",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  lineHeight: 0.6,
                }}
              >
                <span style={{ textAlign: "left" }}>{player.number}</span>
                <span style={{ textAlign: "right" }}>{player.name}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Match View - Logo, Points, Sets, Timeouts */
          <>
        {/* Team A Logo - Top Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2vh",
          }}
        >
          <div
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 0.3vh 0.6vh rgba(0,0,0,0.4))",
            }}
          >
            {teamALogoBase64 ? (
              <img
                src={teamALogoBase64}
                alt={teamA?.name || "Team A"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span style={{ fontSize: "4vw", color: "#999" }}>Logo</span>
            )}
          </div>
        </div>

        {/* Team A Points - Middle Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "15vw",
              fontWeight: "normal",
              lineHeight: 0.6,
              textAlign: "center",
              letterSpacing: "0.1em",
              backgroundColor: "#0f0f0f",
              border: "0.75vh solid #fff",
              borderRadius: 0,
              width: "85%",
              padding: "1vh 0",
              boxSizing: "border-box",
            }}
          >
            {teamAScore.points}
          </div>
        </div>

        {/* Team A Sets and Timeouts - Bottom Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "3vh",
            gap: "2vh",
          }}
        >
          <div
            style={{
              fontSize: "4vw",
              fontWeight: "normal",
              backgroundColor: "#0f0f0f",
              padding: "1.5vh 1.5vw",
              borderRadius: 0,
              letterSpacing: "0.08em",
              width: "85%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              lineHeight: 0.8,
            }}
          >
            <span>SETS</span>
            <span>{teamAScore.sets || 0}</span>
          </div>

          <div
            style={{
              fontSize: "4vw",
              fontWeight: "normal",
              backgroundColor: "#0f0f0f",
              padding: "1.5vh 1.5vw",
              borderRadius: 0,
              letterSpacing: "0.08em",
              width: "85%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              lineHeight: 0.8,
            }}
          >
            <span>TIMEOUTS</span>
            <span>{teamAScore.timeouts || 0}</span>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f0f0f",
        }}
      >
        {/* Team Names - Top Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "5vw",
              fontWeight: "normal",
              lineHeight: 0.8,
              color: teamA?.color || "#1976d2",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1vh",
            }}
          >
            {teamA?.name || "Team A"}
          </div>
          <div
            style={{
              fontSize: "3vw",
              fontWeight: "normal",
              lineHeight: 0.8,
              color: "#888",
              letterSpacing: "0.1em",
              margin: "1vh 0",
            }}
          >
            VS
          </div>
          <div
            style={{
              fontSize: "5vw",
              fontWeight: "normal",
              lineHeight: 0.8,
              color: teamB?.color || "#d32f2f",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginTop: "1vh",
            }}
          >
            {teamB?.name || "Team B"}
          </div>
        </div>

        {/* Time and Set Number - Middle Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "15vw",
                fontWeight: "normal",
                lineHeight: 0.6,
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
            >
              {formatTimeHHMM(timeSec).hours}
              <span style={{ opacity: colonVisible ? 1 : 0 }}>:</span>
              {formatTimeHHMM(timeSec).minutes}
            </div>
            <div
              style={{
                fontSize: "3vw",
                fontWeight: "normal",
                lineHeight: 0.8,
                color: "#aaa",
                letterSpacing: "0.08em",
                marginTop: "1vh",
              }}
            >
              {isWarmupRunning ? `MINUTES UNTIL START` : `SET ${currentSetNum}`}
            </div>
          </div>
        </div>

        {/* Set History Table - Bottom Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "3vh",
          }}
        >
          <div
            style={{
              display: "table",
              width: "85%",
              borderCollapse: "collapse",
            }}
          >
            {/* Row 1: Set Numbers */}
            <div
              style={{
                display: "table-row",
              }}
            >
              {[1, 2, 3, 4, 5].map((setNum) => (
                <div
                  key={`header-${setNum}`}
                  style={{
                    display: "table-cell",
                    fontSize: "3vw",
                    fontWeight: "normal",
                    lineHeight: 0.8,
                    padding: "1.5vh 1.5vw",
                    textAlign: "center",
                    verticalAlign: "bottom",
                    color: "#aaa",
                  }}
                >
                  {setNum}
                </div>
              ))}
            </div>

            {/* Row 2: Team A Points */}
            <div
              style={{
                display: "table-row",
              }}
            >
              {[1, 2, 3, 4, 5].map((setNum) => {
                const set = setHistory.find((s) => s.setNum === setNum);
                return (
                  <div
                    key={`teamA-${setNum}`}
                    style={{
                      display: "table-cell",
                      fontSize: "4vw",
                      fontWeight: "normal",
                      lineHeight: 0.8,
                      padding: "1.5vh 1.5vw",
                      textAlign: "center",
                      verticalAlign: "middle",
                      backgroundColor: teamA?.color || "#1976d2",
                    }}
                  >
                    {set?.teamAPoints ?? 0}
                  </div>
                );
              })}
            </div>

            {/* Spacer Row */}
            <div
              style={{
                display: "table-row",
                height: "2vh",
              }}
            >
              {[1, 2, 3, 4, 5].map((setNum) => (
                <div
                  key={`spacer-${setNum}`}
                  style={{
                    display: "table-cell",
                    height: "2vh",
                  }}
                />
              ))}
            </div>

            {/* Row 3: Team B Points */}
            <div
              style={{
                display: "table-row",
              }}
            >
              {[1, 2, 3, 4, 5].map((setNum) => {
                const set = setHistory.find((s) => s.setNum === setNum);
                return (
                  <div
                    key={`teamB-${setNum}`}
                    style={{
                      display: "table-cell",
                      fontSize: "4vw",
                      fontWeight: "normal",
                      lineHeight: 0.8,
                      padding: "1.5vh 1.5vw",
                      textAlign: "center",
                      verticalAlign: "middle",
                      backgroundColor: teamB?.color || "#d32f2f",
                    }}
                  >
                    {set?.teamBPoints ?? 0}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team B Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: teamB?.color || "#d32f2f",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Team B Logo - Top Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2vh",
          }}
        >
          <div
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: "drop-shadow(0 0.3vh 0.6vh rgba(0,0,0,0.4))",
            }}
          >
            {teamBLogoBase64 ? (
              <img
                src={teamBLogoBase64}
                alt={teamB?.name || "Team B"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span style={{ fontSize: "4vw", color: "#999" }}>Logo</span>
            )}
          </div>
        </div>

        {/* Team B Points - Middle Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: "15vw",
              fontWeight: "normal",
              lineHeight: 0.6,
              textAlign: "center",
              letterSpacing: "0.1em",
              backgroundColor: "#0f0f0f",
              border: "0.75vh solid #fff",
              borderRadius: 0,
              width: "85%",
              padding: "1vh 0",
              boxSizing: "border-box",
            }}
          >
            {teamBScore.points}
          </div>
        </div>

        {/* Team B Sets and Timeouts - Bottom Third */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "3vh",
            gap: "2vh",
          }}
        >
          <div
            style={{
              fontSize: "4vw",
              fontWeight: "normal",
              backgroundColor: "#0f0f0f",
              padding: "1.5vh 1.5vw",
              borderRadius: 0,
              letterSpacing: "0.08em",
              width: "85%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              lineHeight: 0.8,
            }}
          >
            <span>{teamBScore.sets || 0}</span>
            <span>SETS</span>
          </div>

          <div
            style={{
              fontSize: "4vw",
              fontWeight: "normal",
              backgroundColor: "#0f0f0f",
              padding: "1.5vh 1.5vw",
              borderRadius: 0,
              letterSpacing: "0.08em",
              width: "85%",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              lineHeight: 0.8,
            }}
          >
            <span>{teamBScore.timeouts || 0}</span>
            <span>TIMEOUTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
