interface NoteSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NoteSearch({ value, onChange }: NoteSearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="검색..."
      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/50 transition-colors"
    />
  );
}
