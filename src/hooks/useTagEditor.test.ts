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
