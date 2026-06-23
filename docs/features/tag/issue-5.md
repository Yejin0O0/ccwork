# Issue 5: [태그] 칩에서 태그 삭제

## 시그니처

### 컴포넌트 Props

```typescript
// TagInput — onRemove 추가
interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}
```

### 훅 / 함수

```typescript
// useTagEditor — 변경 없음 (removeTag는 Issue #4에서 이미 구현)
export function useTagEditor(initialTags: string[]): {
  tags: string[];
  setTags: (tags: string[]) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (index: number) => void;
};
```

### NoteEditor 연결

```typescript
// useTagEditor에서 removeTag를 꺼내 TagInput의 onRemove에 전달
const { tags, setTags, inputValue, setInputValue, addTag, removeTag } = useTagEditor(
  selectedNote?.tags ?? [],
);

<TagInput
  tags={tags}
  inputValue={inputValue}
  onInputChange={setInputValue}
  onAdd={addTag}
  onRemove={removeTag}
/>
```

### 에러 케이스

- 범위 밖 인덱스 전달 시: `removeTag`가 조용히 무시 (throw 없음). UI 레벨 추가 처리 불필요.

---

## 테스트 시나리오

### 정상

- [x] [정상] TagInput — should render a remove button for each tag chip when tags prop is given
- [x] [정상] TagInput — should call onRemove with correct index when remove button is clicked
- [x] [정상] NoteEditor — should remove tag chip immediately when remove button is clicked
- [x] [정상] NoteEditor — should save note without removed tag when save is clicked after removal

### 경계

- [x] [경계] TagInput — should render no remove buttons when tags array is empty
- [x] [경계] TagInput — should call onRemove with index 0 when the only tag's remove button is clicked
- [x] [경계] NoteEditor — should save with empty tags array when all chips are removed before saving

---

## AC 커버리지

| AC                                        | 커버 시나리오                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| AC-1 (각 칩에 × 버튼 표시)                | [정상] TagInput — should render a remove button for each tag chip                                                  |
| AC-2 (× 클릭 시 칩 즉시 제거)             | [정상] TagInput — should call onRemove with correct index / [정상] NoteEditor — should remove tag chip immediately |
| AC-3 (삭제 후 저장 시 제거된 태그 미포함) | [정상] NoteEditor — should save note without removed tag                                                           |
| AC-4 (저장 전 서버 반영 없음)             | [경계] NoteEditor — should save with empty tags array when all chips are removed before saving                     |
