import { renderHook, act } from '@testing-library/react';
import { useTagEditor } from './useTagEditor';

describe('useTagEditor', () => {
  it('should return initialTags as tags when initialized with existing tags', () => {
    const { result } = renderHook(() => useTagEditor(['react', 'typescript']));
    expect(result.current.tags).toEqual(['react', 'typescript']);
  });

  it('should return empty array as tags when initialized with empty array', () => {
    const { result } = renderHook(() => useTagEditor([]));
    expect(result.current.tags).toEqual([]);
  });
});

describe('addTag', () => {
  it('should append tag to tags array when valid value is given', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('react');
    });
    expect(result.current.tags).toContain('react');
  });

  it('should normalize input to lowercase when uppercase letters are given', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('TypeScript');
    });
    expect(result.current.tags).toContain('typescript');
    expect(result.current.tags).not.toContain('TypeScript');
  });

  it('should clear inputValue after tag is successfully added', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.setInputValue('react');
    });
    expect(result.current.inputValue).toBe('react');
    act(() => {
      result.current.addTag('react');
    });
    expect(result.current.inputValue).toBe('');
  });

  it('should do nothing when input is empty string', () => {
    const { result } = renderHook(() => useTagEditor(['react']));
    act(() => {
      result.current.addTag('');
    });
    expect(result.current.tags).toEqual(['react']);
  });

  it('should do nothing when input is whitespace only', () => {
    const { result } = renderHook(() => useTagEditor(['react']));
    act(() => {
      result.current.addTag('   ');
    });
    expect(result.current.tags).toEqual(['react']);
  });
});

describe('addTag - validation', () => {
  it('should add tag when input is exactly 15 characters', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('a'.repeat(15));
    });
    expect(result.current.tags).toContain('a'.repeat(15));
  });

  it('should add tag when input contains only allowed characters (lowercase, korean, number, hyphen)', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('react-태그1');
    });
    expect(result.current.tags).toContain('react-태그1');
  });

  it('should not add tag and set isShaking true when input is exactly 16 characters', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('a'.repeat(16));
    });
    expect(result.current.tags).toEqual([]);
    expect(result.current.isShaking).toBe(true);
  });

  it('should not add tag and set isShaking true when input is a duplicate after normalization', () => {
    const { result } = renderHook(() => useTagEditor(['react']));
    act(() => {
      result.current.addTag('React');
    });
    expect(result.current.tags).toEqual(['react']);
    expect(result.current.isShaking).toBe(true);
  });

  it('should not add tag and set isShaking true when input exceeds 15 characters', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('a'.repeat(20));
    });
    expect(result.current.tags).toEqual([]);
    expect(result.current.isShaking).toBe(true);
  });

  it('should not add tag and set isShaking true when input contains disallowed characters', () => {
    const { result } = renderHook(() => useTagEditor([]));
    act(() => {
      result.current.addTag('react!!');
    });
    expect(result.current.tags).toEqual([]);
    expect(result.current.isShaking).toBe(true);
  });

  it('should not add tag and set isShaking true when duplicate tag is entered', () => {
    const { result } = renderHook(() => useTagEditor(['react']));
    act(() => {
      result.current.addTag('react');
    });
    expect(result.current.tags).toEqual(['react']);
    expect(result.current.isShaking).toBe(true);
  });

  it('should not trigger shaking when input is empty string', () => {
    const { result } = renderHook(() => useTagEditor(['react']));
    act(() => {
      result.current.addTag('');
    });
    expect(result.current.isShaking).toBe(false);
  });
});

describe('isMaxed', () => {
  const tenTags = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

  it('should return isMaxed as false when initialized with fewer than 10 tags', () => {
    const { result } = renderHook(() => useTagEditor(['react', 'typescript']));
    expect(result.current.isMaxed).toBe(false);
  });

  it('should return isMaxed as true when tags count is exactly 10', () => {
    const { result } = renderHook(() => useTagEditor(tenTags));
    expect(result.current.isMaxed).toBe(true);
  });

  it('should return isMaxed as false when tags count is exactly 9', () => {
    const { result } = renderHook(() => useTagEditor(tenTags));
    expect(result.current.isMaxed).toBe(true);
    act(() => {
      result.current.removeTag(0);
    });
    expect(result.current.isMaxed).toBe(false);
  });

  it('should return isMaxed as false after removeTag brings count to 9', () => {
    const { result } = renderHook(() => useTagEditor(tenTags));
    expect(result.current.isMaxed).toBe(true);
    act(() => {
      result.current.removeTag(9);
    });
    expect(result.current.isMaxed).toBe(false);
  });
});

describe('removeTag', () => {
  it('should leave tags unchanged and not throw when index is out of bounds', () => {
    const { result } = renderHook(() => useTagEditor(['react']));
    expect(() => {
      act(() => {
        result.current.removeTag(99);
      });
    }).not.toThrow();
    expect(result.current.tags).toEqual(['react']);
  });

  it('should expose removeTag function in return value', () => {
    const { result } = renderHook(() => useTagEditor([]));
    expect(typeof result.current.removeTag).toBe('function');
  });
});
