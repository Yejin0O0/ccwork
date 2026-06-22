import { useState } from 'react';

export function useTagEditor(initialTags: string[]) {
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');

  function addTag(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;
    setTags((prev) => [...prev, normalized]);
    setInputValue('');
  }

  function removeTag(index: number) {
    if (index < 0 || index >= tags.length) return;
    setTags((prev) => prev.filter((_, i) => i !== index));
  }

  return { tags, setTags, inputValue, setInputValue, addTag, removeTag };
}
