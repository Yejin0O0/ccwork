# Issue 7: [태그] 최대 10개 제한 UX

## 시그니처

### 훅 / 함수

```typescript
// useTagEditor — isMaxed 파생값 추가
const MAX_TAG_COUNT = 10;

export function useTagEditor(initialTags: string[]): {
  tags: string[];
  setTags: (tags: string[]) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (index: number) => void;
  isShaking: boolean;
  resetShaking: () => void;
  isMaxed: boolean; // tags.length >= MAX_TAG_COUNT
};
```

### 컴포넌트 Props

```typescript
// TagInput — isMaxed 추가 (선택적, 기존 테스트 호환)
interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  isShaking?: boolean;
  onShakeEnd?: () => void;
  isMaxed?: boolean; // 기본값 false
}

// isMaxed=true 시:
// - <input disabled />
// - "태그는 최대 10개까지 추가할 수 있습니다" 문구 렌더링
// AC-4(Enter/쉼표 무반응)는 HTML disabled 속성이 자동 처리
```

### NoteEditor 연결

```typescript
const { tags, setTags, inputValue, setInputValue, addTag, removeTag,
        isShaking, resetShaking, isMaxed } = useTagEditor(selectedNote?.tags ?? []);

<TagInput
  tags={tags}
  inputValue={inputValue}
  onInputChange={setInputValue}
  onAdd={addTag}
  onRemove={removeTag}
  isShaking={isShaking}
  onShakeEnd={resetShaking}
  isMaxed={isMaxed}
/>
```

### 에러 케이스

- `isMaxed=true` 상태에서 HTML `disabled` 속성이 Enter/쉼표 입력 자동 차단

---

## 테스트 시나리오

### 정상

- [x] [정상] useTagEditor — should return isMaxed as false when initialized with fewer than 10 tags
- [x] [정상] useTagEditor — should return isMaxed as false after removeTag brings count to 9
- [x] [정상] TagInput — should disable input when isMaxed is true
- [x] [정상] TagInput — should show max count message when isMaxed is true
- [x] [정상] TagInput — should enable input when isMaxed is false
- [x] [정상] TagInput — should not show max count message when isMaxed is false

### 경계

- [x] [경계] useTagEditor — should return isMaxed as true when tags count is exactly 10
- [x] [경계] useTagEditor — should return isMaxed as false when tags count is exactly 9

### 예외

- [x] [예외] TagInput — should not call onAdd when Enter is pressed while input is disabled
- [x] [예외] TagInput — should not call onAdd when comma is typed while input is disabled

---

## AC 커버리지

| AC                                    | 커버 시나리오                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| AC-1 (10개 → disabled)                | [경계] useTagEditor isMaxed=true at 10 + [정상] TagInput disabled when isMaxed=true           |
| AC-2 (10개 → 안내 문구)               | [정상] TagInput shows message when isMaxed=true                                               |
| AC-3 (삭제 후 재활성화 + 문구 사라짐) | [경계] useTagEditor isMaxed=false at 9 + [정상] TagInput enable/no-message when isMaxed=false |
| AC-4 (disabled 시 Enter/쉼표 무반응)  | [예외] TagInput no onAdd on Enter/comma when disabled                                         |
