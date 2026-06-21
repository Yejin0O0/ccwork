export function useTagEditor(_initialTags: string[]) {
  return {
    tags: [] as string[],
    inputValue: '',
    setInputValue: (_: string) => {},
    addTag: (_: string) => {},
    removeTag: (_: number) => {},
  };
}
