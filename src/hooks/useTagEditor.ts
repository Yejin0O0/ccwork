import { useState } from 'react';

const MAX_TAG_LENGTH = 15;
const MAX_TAG_COUNT = 10;
const ALLOWED_PATTERN = /^[a-z0-9가-힣-]+$/;

export function useTagEditor(initialTags: string[]) {
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  function addTag(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;

    if (
      normalized.length > MAX_TAG_LENGTH ||
      !ALLOWED_PATTERN.test(normalized) ||
      tags.includes(normalized)
    ) {
      setIsShaking(true);
      return;
    }

    setTags((prev) => [...prev, normalized]);
    setInputValue('');
  }

  function removeTag(index: number) {
    if (index < 0 || index >= tags.length) return;
    setTags((prev) => prev.filter((_, i) => i !== index));
  }

  function resetShaking() {
    setIsShaking(false);
  }

  return {
    tags,
    setTags,
    inputValue,
    setInputValue,
    addTag,
    removeTag,
    isShaking,
    resetShaking,
    isMaxed: tags.length >= MAX_TAG_COUNT,
  };
}
