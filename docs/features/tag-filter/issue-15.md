# Issue 15: 태그로 노트 필터링

## 시그니처

### 컴포넌트 Props

```tsx
// NoteItem Props 확장
interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  activeTag: string | null; // 현재 활성 필터 태그
  onTagClick: (tag: string) => void; // 태그 칩 클릭 핸들러
}

// NoteList Props 확장
interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  searchQuery?: string;
  activeTag: string | null; // 현재 활성 필터 태그
  onTagFilter: (tag: string) => void; // NoteItem → NoteList → App으로 이벤트 전달
}
```

### App.tsx 상태

```tsx
const [activeTag, setActiveTag] = useState<string | null>(null);

const handleTagFilter = (tag: string) => {
  setActiveTag((prev) => (prev === tag ? null : tag));
};
```

### 에러 케이스

클라이언트 사이드 필터링이므로 별도 에러 없음.

---

## 테스트 시나리오

### 정상

- [x] [정상] NoteItem — should render a chip for each tag when note.tags is not empty
- [x] [정상] NoteItem — should call onTagClick with the tag name when a tag chip is clicked
- [x] [정상] NoteItem — should apply active style to the chip that matches activeTag
- [x] [정상] NoteList — should show only notes that include activeTag when activeTag is set
- [x] [정상] NoteList — should show all notes when activeTag is null
- [x] [정상] NoteList — should display filter status text when activeTag is set
- [x] [정상] NoteList — should apply searchQuery and activeTag as AND condition simultaneously

### 경계

- [x] [경계] NoteItem — should render no tag chips when note.tags is empty array
- [x] [경계] NoteList — should show empty state message when no notes match activeTag filter

### 예외

- (해당 없음 — 클라이언트 사이드 필터링으로 API 호출 없음)

### AC-4 보완 (ac-verifier 갭 발견)

- [x] [정상] App — should deactivate tag filter when the active tag chip is clicked again

---

## AC 커버리지

| AC                                          | 커버 시나리오                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| AC-1: NoteItem에 태그 칩 표시               | [정상] NoteItem — should render a chip for each tag...                                   |
| AC-2: 태그 칩 클릭 시 해당 태그 노트만 표시 | [정상] NoteList — should show only notes that include activeTag...                       |
| AC-3: 필터 적용 중 UI에 표시                | [정상] NoteList — should display filter status text when activeTag is set                |
| AC-4: 필터 해제 시 전체 목록 복귀           | [정상] NoteList — should show all notes when activeTag is null                           |
| AC-5: 필터와 텍스트 검색 동시 적용 (AND)    | [정상] NoteList — should apply searchQuery and activeTag as AND condition simultaneously |
