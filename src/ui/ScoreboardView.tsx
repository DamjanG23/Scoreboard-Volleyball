interface ScoreboardViewProps {
  currentMatch: Match | null;
}

export default function ScoreboardView({ currentMatch }: ScoreboardViewProps) {
  const teamA = currentMatch?.teams?.teamA;
  const teamB = currentMatch?.teams?.teamB;
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

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
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
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "3vh",
          gap: "2vh",
        }}
      >
        {/* Team A Logo */}
        <div
          style={{
            width: "20vw",
            height: "20vw",
            maxWidth: "300px",
            maxHeight: "300px",
            backgroundColor: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "0.5vw solid #fff",
          }}
        >
          {teamA?.logoPath ? (
            <img
              src={teamA.logoPath}
              alt={teamA.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <span style={{ fontSize: "4vw", color: "#999" }}>Logo</span>
          )}
        </div>

        {/* Team A Points */}
        <div
          style={{
            fontSize: "15vw",
            fontWeight: "bold",
            lineHeight: 1,
            textAlign: "center",
            textShadow: "0 0.5vh 1vh rgba(0,0,0,0.5)",
          }}
        >
          {teamAScore.points}
        </div>

        {/* Team A Sets */}
        <div
          style={{
            fontSize: "3vw",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "1vh 3vw",
            borderRadius: "1vh",
            textAlign: "center",
          }}
        >
          SETS: {teamAScore.sets || 0}
        </div>

        {/* Team A Timeouts */}
        <div
          style={{
            fontSize: "2.5vw",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "1vh 3vw",
            borderRadius: "1vh",
            textAlign: "center",
          }}
        >
          TIMEOUTS: {teamAScore.timeouts || 0}
        </div>
      </div>

      {/* Middle Section */}
      <div
        style={{
          flex: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "3vh",
          gap: "2vh",
          backgroundColor: "#1a1a1a",
        }}
      >
        {/* Team Names */}
        <div
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "4vw",
              fontWeight: "bold",
              marginBottom: "1vh",
              color: teamA?.color || "#1976d2",
            }}
          >
            {teamA?.name || "Team A"}
          </div>
          <div
            style={{
              fontSize: "3vw",
              fontWeight: "bold",
              margin: "1vh 0",
              color: "#888",
            }}
          >
            VS
          </div>
          <div
            style={{
              fontSize: "4vw",
              fontWeight: "bold",
              marginTop: "1vh",
              color: teamB?.color || "#d32f2f",
            }}
          >
            {teamB?.name || "Team B"}
          </div>
        </div>

        {/* Time and Set Number */}
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "2vh 4vw",
            borderRadius: "1vh",
            width: "80%",
          }}
        >
          <div
            style={{ fontSize: "6vw", fontWeight: "bold", marginBottom: "1vh" }}
          >
            {formatTime(timeSec)}
          </div>
          <div style={{ fontSize: "2.5vw", color: "#aaa" }}>
            SET {currentSetNum}
          </div>
        </div>

        {/* Set History */}
        <div
          style={{
            width: "90%",
            flex: 1,
            overflowY: "auto",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "1vh",
            padding: "2vh",
          }}
        >
          <div
            style={{
              fontSize: "2vw",
              fontWeight: "bold",
              marginBottom: "2vh",
              textAlign: "center",
              color: "#aaa",
            }}
          >
            SET HISTORY
          </div>
          {setHistory.length === 0 ? (
            <div
              style={{ textAlign: "center", color: "#666", fontSize: "1.5vw" }}
            >
              No sets played yet
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1vh" }}
            >
              {setHistory.map((set) => (
                <div
                  key={set.setNum}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 1fr",
                    gap: "1vw",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    padding: "1vh 2vw",
                    borderRadius: "0.5vh",
                    fontSize: "1.8vw",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#aaa" }}>
                    Set {set.setNum}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ color: teamA?.color || "#1976d2" }}>
                      {set.teamAPoints}
                    </span>
                    <span style={{ color: "#666" }}>-</span>
                    <span style={{ color: teamB?.color || "#d32f2f" }}>
                      {set.teamBPoints}
                    </span>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      color: "#888",
                      fontSize: "1.5vw",
                    }}
                  >
                    {formatSetTime(set.timeSec)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team B Section */}
      <div
        style={{
          flex: 1,
          backgroundColor: teamB?.color || "#d32f2f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "3vh",
          gap: "2vh",
        }}
      >
        {/* Team B Logo */}
        <div
          style={{
            width: "20vw",
            height: "20vw",
            maxWidth: "300px",
            maxHeight: "300px",
            backgroundColor: "#fff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "0.5vw solid #fff",
          }}
        >
          {teamB?.logoPath ? (
            <img
              src={teamB.logoPath}
              alt={teamB.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <span style={{ fontSize: "4vw", color: "#999" }}>Logo</span>
          )}
        </div>

        {/* Team B Points */}
        <div
          style={{
            fontSize: "15vw",
            fontWeight: "bold",
            lineHeight: 1,
            textAlign: "center",
            textShadow: "0 0.5vh 1vh rgba(0,0,0,0.5)",
          }}
        >
          {teamBScore.points}
        </div>

        {/* Team B Sets */}
        <div
          style={{
            fontSize: "3vw",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "1vh 3vw",
            borderRadius: "1vh",
            textAlign: "center",
          }}
        >
          SETS: {teamBScore.sets || 0}
        </div>

        {/* Team B Timeouts */}
        <div
          style={{
            fontSize: "2.5vw",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "1vh 3vw",
            borderRadius: "1vh",
            textAlign: "center",
          }}
        >
          TIMEOUTS: {teamBScore.timeouts || 0}
        </div>
      </div>
    </div>
  );
}
