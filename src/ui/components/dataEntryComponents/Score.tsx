interface ScoreProps {
  text: string;
}

export function Score({ text }: ScoreProps) {
  return <>${text}</>;
}
