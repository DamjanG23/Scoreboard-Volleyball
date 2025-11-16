export const ensure14Players = (players?: Player[]): Player[] => {
  const base = players ? [...players] : [];
  while (base.length < 14) {
    base.push({ number: base.length + 1, name: "" });
  }
  return base.slice(0, 14);
};

// TODO: Replace with actual saved teams from backend
export const mockSavedTeams: Team[] = [
  {
    name: "Team Alpha",
    coach: "Coach Smith",
    logoPath: "",
    color: "#ff5722",
    players: ensure14Players([
      { number: 1, name: "John Doe" },
      { number: 2, name: "Jane Smith" },
    ]),
  },
  {
    name: "Team Beta",
    coach: "Coach Johnson",
    logoPath: "",
    color: "#2196f3",
    players: ensure14Players([
      { number: 1, name: "Alice Brown" },
      { number: 2, name: "Bob Wilson" },
    ]),
  },
  {
    name: "Team Gamma",
    coach: "Coach Williams",
    logoPath: "",
    color: "#4caf50",
    players: ensure14Players([
      { number: 1, name: "Charlie Davis" },
      { number: 2, name: "Diana Martinez" },
    ]),
  },
];
