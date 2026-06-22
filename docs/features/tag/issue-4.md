# Issue 4: [태그] 태그 입력 및 칩 표시 — 기본 추가·저장 흐름

## 시그니처

### 타입 확장

```typescript
// src/types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[]; // 추가. 필수 필드 — 구버전 노트 호환은 NoteEditor에서 ?? []로 처리
  createdAt: string;
  updatedAt: string;
}
```

### 훅

```typescript
// src/hooks/useTagEditor.ts
export function useTagEditor(initialTags: string[]): {
  tags: string[];
  setTags: (tags: string[]) => void; // 추가. NoteEditor가 노트 전환 시 태그 동기화에 사용
  inputValue: string;
  setInputValue: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (index: number) => void;
};
```

### 컴포넌트 Props

```typescript
// src/components/TagInput.tsx
interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  // onRemove는 Issue #5에서 추가
}

export default function TagInput(props: TagInputProps): JSX.Element;
```

### Context 변경

```typescript
// src/context/NotesContext.tsx
// NotesContextType.createNote 시그니처만 변경
createNote: (title: string, content: string, tags: string[]) => Promise<void>;
```

### 변경 없음

- `src/api/notes.ts` — `createNote(Omit<Note, ...>)`, `updateNote(Partial<Note>)` 패턴이 tags를 자동 수용
- `NoteEditor` Props — 외부 인터페이스 변경 없음. 내부에서 `useTagEditor` + `TagInput` 추가

### 에러 케이스

| 함수        | 조건                       | 동작                                          |
| ----------- | -------------------------- | --------------------------------------------- |
| `addTag`    | 빈 문자열 또는 공백만 입력 | 무시 — throw 없음, shake 없음 (Issue #6 범위) |
| `removeTag` | 유효하지 않은 index        | 무시 — throw 없음                             |

---

## 테스트 시나리오

### 정상

**useTagEditor**

- [x] [정상] useTagEditor — should return initialTags as tags when initialized with existing tags
- [x] [정상] addTag — should append tag to tags array when valid value is given
- [x] [정상] addTag — should normalize input to lowercase when uppercase letters are given
- [x] [정상] addTag — should clear inputValue after tag is successfully added

**TagInput**

- [x] [정상] TagInput — should render each tag as a chip element when tags prop is given
- [x] [정상] TagInput — should call onAdd with current inputValue when Enter key is pressed
- [x] [정상] TagInput — should call onAdd with value stripped of comma when comma is typed
- [x] [정상] TagInput — should call onInputChange when input value changes

**NoteEditor 통합**

- [x] [정상] NoteEditor — should initialize useTagEditor with selectedNote.tags when a note is selected
- [x] [정상] NoteEditor — should initialize useTagEditor with empty array when creating new note
- [x] [정상] NoteEditor — should include tags in updateNote call when save is clicked
- [x] [정상] NoteEditor — should include tags in createNote call when save is clicked
- [x] [정상] NoteEditor — should restore saved tags as chips when same note is re-selected
- [x] [정상] NoteEditor — should include existing tags when only title or content is changed before save
- [x] [정상] NoteEditor — should render tag input placeholder when creating new note
- [x] [정상] useTagEditor — should expose removeTag function in return value

### 경계

- [x] [경계] useTagEditor — should return empty array as tags when initialized with empty array
- [x] [경계] NoteEditor — should initialize useTagEditor with empty array when selectedNote has no tags field (구버전 노트)
- [x] [경계] addTag — should do nothing when input is empty string
- [x] [경계] addTag — should do nothing when input is whitespace only
- [x] [경계] TagInput — should render no chips when tags prop is empty array
- [x] [경계] NoteEditor — should render zero chips when selectedNote has no tags field

### 예외

- [x] [예외] removeTag — should leave tags unchanged and not throw when index is out of bounds
- [x] [예외] NoteEditor — should keep tags state unchanged when save API call fails

---

## AC 커버리지

| AC                                                    | 커버 시나리오                                                                                  |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `Note.tags: string[]` 필드 추가                       | [확정] 시그니처 — 타입 레벨 결정                                                               |
| 구버전 노트 에러 없이 렌더링 (기본값 `[]`)            | [경계] NoteEditor — should initialize with `[]` when selectedNote has no tags field            |
| `api.createNote` / `api.updateNote` 호출 시 tags 포함 | [정상] NoteEditor — should include tags in createNote / updateNote call                        |
| `useTagEditor` 반환 타입                              | [정상] useTagEditor — should return initialTags as tags                                        |
| `TagInput` 입력 필드 + 칩 목록 렌더링                 | [정상] TagInput — should render each tag as chip / [경계] should render no chips               |
| NoteEditor에 TagInput 포함                            | [정상] NoteEditor — should initialize useTagEditor and render TagInput                         |
| Enter / 쉼표로 태그 추가, 입력창 초기화               | [정상] TagInput — should call onAdd on Enter / comma + [정상] addTag — should clear inputValue |
| 대문자 소문자 정규화                                  | [정상] addTag — should normalize to lowercase                                                  |
| 빈 입력 무시 (shake 없음)                             | [경계] addTag — should do nothing when empty or whitespace only                                |
| 칩 즉시 표시                                          | [정상] TagInput — should render each tag as chip                                               |
| 저장 시 tags 배열 포함                                | [정상] NoteEditor — should include tags in save call                                           |
| 재선택 시 태그 복원                                   | [정상] NoteEditor — should restore saved tags when re-selected                                 |
| 태그 미수정 저장 시 기존 태그 보존                    | [정상] NoteEditor — should include existing tags when only title/content changed               |
| (에러 케이스) removeTag 잘못된 index                  | [예외] removeTag — should leave tags unchanged when index is out of bounds                     |
| (에러 케이스) API 실패 시 tags 유지                   | [예외] NoteEditor — should keep tags state unchanged when save fails                           |
