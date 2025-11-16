export const ensure14Players = (players?: Player[]): Player[] => {
  const base = players ? [...players] : [];
  while (base.length < 14) {
    base.push({ number: base.length + 1, name: "" });
  }
  return base.slice(0, 14);
};
