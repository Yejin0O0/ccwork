# Issue 13: bug: 한글 태그 입력 시 마지막 글자가 별도 태그로 중복 생성됨

## 시그니처

### 컴포넌트 Props

변경 없음 — `TagInputProps` 인터페이스 현행 유지.

```tsx
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
```

### 에러 케이스

- IME 조합 중(`e.nativeEvent.isComposing === true`) Enter 키 입력 → `onAdd` 호출하지 않음

---

## 테스트 시나리오

### 정상

- [x] `[정상] TagInput — should call onAdd with inputValue when Enter is pressed with isComposing false`

### 예외

- [x] `[예외] TagInput — should NOT call onAdd when Enter is pressed with isComposing true`
- [x] `[예외] TagInput — should call onAdd exactly once when IME fires two consecutive Enter keydowns`

---

## AC 커버리지

| 기대 동작                                      | 커버 시나리오                                |
| ---------------------------------------------- | -------------------------------------------- |
| Enter 시 입력한 단어 전체가 태그 하나로만 추가 | `[정상]` isComposing false → onAdd 호출      |
| IME 조합 중 Enter 는 무시                      | `[예외]` isComposing true → onAdd 호출 안 함 |
