import { TeamsInput } from "./TeamInput";

interface TeamsProps {
  matchTeams: MatchTeams | undefined;
}

export function Teams({ matchTeams }: TeamsProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {/* LEFT SIDE — HOME TEAM */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <h2>HOME TEAM</h2>
        <TeamsInput team={matchTeams?.teamA}></TeamsInput>
      </div>
      {/* RIGHT SIDE — AWAY TEAM */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <h2>AWAY TEAM</h2>
        <TeamsInput team={matchTeams?.teamB}></TeamsInput>
      </div>
    </div>
  );
}
