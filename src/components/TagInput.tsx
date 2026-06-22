interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
}

export default function TagInput({ tags, inputValue, onInputChange, onAdd }: TagInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onAdd(inputValue);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.endsWith(',')) {
      handleCommaSeparator();
    } else {
      onInputChange(value);
    }
  }

  function handleCommaSeparator() {
    onAdd(inputValue);
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center border border-border rounded-xl px-3 py-2">
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-lg">
            {tag}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="text-sm bg-transparent outline-none flex-1 min-w-20 placeholder:text-muted-foreground/50"
        placeholder="태그 입력 후 Enter"
      />
    </div>
  );
}
