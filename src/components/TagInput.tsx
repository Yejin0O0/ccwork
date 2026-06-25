interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  isShaking?: boolean;
  onShakeEnd?: () => void;
  isMaxed?: boolean;
}

export default function TagInput({
  tags,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  isShaking = false,
  onShakeEnd = () => {},
  isMaxed = false,
}: TagInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      onAdd(inputValue);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.endsWith(',')) {
      onAdd(inputValue);
    } else {
      onInputChange(value);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center border border-border rounded-xl px-3 py-2">
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <li
            key={tag}
            className="group flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
          >
            <span>{tag}</span>
            <button
              type="button"
              aria-label={`${tag} 삭제`}
              onClick={() => onRemove(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onAnimationEnd={onShakeEnd}
        disabled={isMaxed}
        className={`text-sm bg-transparent outline-none flex-1 min-w-20 placeholder:text-muted-foreground/50${isShaking ? ' animate-shake' : ''}`}
        placeholder="태그 입력 후 Enter"
      />
      {isMaxed && (
        <p className="w-full text-xs text-muted-foreground mt-1">
          태그는 최대 10개까지 추가할 수 있습니다
        </p>
      )}
    </div>
  );
}
