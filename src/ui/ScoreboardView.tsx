interface ScoreboardViewProps {
  currentMatch: Match | null;
}

export default function ScoreboardView({ currentMatch }: ScoreboardViewProps) {
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Scoreboard Content</h2>
      <div style={{ marginTop: "20px" }}>
        <h3>Current Match (Debug):</h3>
        <pre
          style={{
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            padding: "15px",
            borderRadius: "5px",
            overflow: "auto",
            maxHeight: "80vh",
          }}
        >
          {JSON.stringify(currentMatch, null, 2)}
        </pre>
      </div>
    </div>
  );
}
