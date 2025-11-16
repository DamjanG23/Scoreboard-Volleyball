interface ConfigProps {
  text: string;
}

export function Config({ text }: ConfigProps) {
  return <>${text}</>;
}
