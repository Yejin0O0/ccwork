# Issue 6: [태그] 유효성 검사 및 shake 피드백

## 시그니처

### 훅 / 함수

```typescript
// useTagEditor — isShaking, resetShaking 추가
export function useTagEditor(initialTags: string[]): {
  tags: string[];
  setTags: (tags: string[]) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  addTag: (value: string) => void;
  removeTag: (index: number) => void;
  isShaking: boolean;
  resetShaking: () => void;
};

// 유효성 검사 규칙 (addTag 내부, 정규화 이후 순서대로 적용)
// 1. 빈 값 → 조용히 무시 (기존)
// 2. 15자 초과 → shake 트리거, 미추가
// 3. 허용 문자 위반 /^[a-z0-9가-힣-]+$/ → shake 트리거, 미추가
// 4. 중복 → shake 트리거, 미추가
```

### 컴포넌트 Props

```typescript
// TagInput — isShaking, onShakeEnd 추가
interface TagInputProps {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  isShaking: boolean;
  onShakeEnd: () => void;
}
```

### NoteEditor 연결

```typescript
const { tags, setTags, inputValue, setInputValue, addTag, removeTag, isShaking, resetShaking } =
  useTagEditor(selectedNote?.tags ?? []);

<TagInput
  tags={tags}
  inputValue={inputValue}
  onInputChange={setInputValue}
  onAdd={addTag}
  onRemove={removeTag}
  isShaking={isShaking}
  onShakeEnd={resetShaking}
/>
```

### 에러 케이스

- 15자 초과, 허용 문자 위반, 중복: `isShaking`을 true로 전환, 태그 미추가
- `onAnimationEnd` 발생 시 TagInput이 `onShakeEnd` 호출 → `isShaking` false로 복귀

---

## 테스트 시나리오

### 정상

- [x] [정상] addTag — should add tag when input is exactly 15 characters
- [x] [정상] addTag — should add tag when input contains only allowed characters (lowercase, korean, number, hyphen)
- [x] [정상] TagInput — should apply shake class to input when isShaking is true
- [x] [정상] TagInput — should call onShakeEnd when animation ends on input

### 경계

- [x] [경계] addTag — should not add tag and set isShaking true when input is exactly 16 characters
- [x] [경계] addTag — should not add tag and set isShaking true when input is a duplicate after normalization

### 예외

- [x] [예외] addTag — should not add tag and set isShaking true when input exceeds 15 characters
- [x] [예외] addTag — should not add tag and set isShaking true when input contains disallowed characters
- [x] [예외] addTag — should not add tag and set isShaking true when duplicate tag is entered
- [x] [예외] addTag — should not trigger shaking when input is empty string

---

## AC 커버리지

| AC                                  | 커버 시나리오                                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| AC-1 (15자 초과 → shake, 미추가)    | [예외] addTag — should not add tag and set isShaking true when input exceeds 15 characters / [경계] 16자 케이스        |
| AC-2 (허용 문자 위반 → shake, 거부) | [예외] addTag — should not add tag and set isShaking true when input contains disallowed characters                    |
| AC-3 (중복 → shake, 거부)           | [예외] addTag — should not add tag and set isShaking true when duplicate tag is entered / [경계] 정규화 후 중복 케이스 |
| AC-4 (shake 완료 후 입력 가능 복귀) | [정상] TagInput — should call onShakeEnd when animation ends on input                                                  |
