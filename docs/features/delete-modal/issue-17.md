# Issue 17: feat: 노트 삭제 확인 모달

## 시그니처

### 컴포넌트 Props

```typescript
// src/components/note/DeleteConfirmModal.tsx

interface DeleteConfirmModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 삭제 대상 노트 제목 (모달 내 표시용) */
  noteTitle: string;
  /** "삭제" 버튼 클릭 또는 확인 시 호출 */
  onConfirm: () => void;
  /** "취소" 버튼 클릭 또는 오버레이 클릭 시 호출 */
  onCancel: () => void;
}
```

```typescript
// NoteItem Props 변경 없음 — onDelete: (id: string) => void 그대로 유지
// NoteItem 내부에서 삭제 버튼 클릭 시 즉시 onDelete를 호출하는 대신
// DeleteConfirmModal을 열고 onConfirm 시 onDelete를 호출한다
```

### 에러 케이스

- `isOpen`이 `false`일 때 모달 콘텐츠가 DOM에 렌더링되지 않는다
- `onConfirm` / `onCancel` 호출 후 모달의 열림/닫힘 상태 제어는 부모(NoteItem)가 담당한다

---

## 테스트 시나리오

### 정상

- [정상] DeleteConfirmModal — should render modal with note title when isOpen is true
- [정상] DeleteConfirmModal — should call onConfirm when "삭제" button is clicked
- [정상] DeleteConfirmModal — should call onCancel when "취소" button is clicked
- [정상] DeleteConfirmModal — should call onCancel when overlay is clicked
- [정상] NoteItem — should open DeleteConfirmModal when delete button is clicked
- [정상] NoteItem — should call onDelete after confirming deletion in modal

### 경계

- [경계] DeleteConfirmModal — should display empty string as note title when noteTitle is empty
- [경계] NoteItem — should not call onDelete when modal is cancelled after delete button click

### 예외

- [예외] DeleteConfirmModal — should not render modal content when isOpen is false
- [예외] NoteItem — should not call onDelete immediately when delete button is clicked

---

## AC 커버리지

| AC                                                               | 커버 시나리오                                                                                                                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-1: 삭제 버튼 클릭 시 즉시 삭제되지 않고 확인 모달이 표시된다  | [정상] NoteItem — should open DeleteConfirmModal when delete button is clicked / [예외] NoteItem — should not call onDelete immediately when delete button is clicked         |
| AC-2: 모달에 삭제할 노트 제목이 표시된다                         | [정상] DeleteConfirmModal — should render modal with note title when isOpen is true                                                                                           |
| AC-3: 모달에서 "삭제" 클릭 시 노트가 삭제된다                    | [정상] DeleteConfirmModal — should call onConfirm when "삭제" button is clicked / [정상] NoteItem — should call onDelete after confirming deletion in modal                   |
| AC-4: 모달에서 "취소" 클릭 시 노트가 삭제되지 않고 모달이 닫힌다 | [정상] DeleteConfirmModal — should call onCancel when "취소" button is clicked / [경계] NoteItem — should not call onDelete when modal is cancelled after delete button click |
| AC-5: 모달 바깥(오버레이) 클릭 시 모달이 닫힌다                  | [정상] DeleteConfirmModal — should call onCancel when overlay is clicked                                                                                                      |
