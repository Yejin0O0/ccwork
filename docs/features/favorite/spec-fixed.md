# 즐겨찾기 기능 상세 스펙

## 결정 요약

| 항목        | 결정                                          |
| ----------- | --------------------------------------------- |
| 저장 방식   | `Note` 타입에 `isFavorite: boolean` 필드 추가 |
| 버튼 위치   | `NoteItem` 카드에 배치                        |
| 모아보기    | `NoteList` 상단 "전체 / 즐겨찾기" 필터 탭     |
| 저장 타이밍 | 토글 즉시 PATCH (저장 버튼 무관)              |
| 정렬 순서   | 기존 노트 순서 유지 (`createdAt` 기준)        |
| 아이콘 표시 | 항상 표시 — 즐겨찾기면 ★, 아니면 ☆            |

---

## 데이터 구조

### Note 타입 변경

```ts
// src/types/note.ts
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean; // 추가
  createdAt: string;
  updatedAt: string;
}
```

### 저장 규칙

- 새 노트 생성 시 `isFavorite: false`로 초기화
- 기존 노트에 `isFavorite` 필드 없을 경우 `false`로 기본값 처리
- 토글 시 `updatedAt`은 갱신하지 않음 (즐겨찾기는 내용 수정이 아님)

---

## UI 동작

### NoteItem 카드 — 즐겨찾기 버튼

- 카드 우측 상단에 별 아이콘 버튼 항상 표시
- `isFavorite: true` → ★ (채워진 별, 노란색)
- `isFavorite: false` → ☆ (빈 별, 회색)
- 클릭 즉시 `updateNote({ isFavorite: !current })` PATCH 요청
- 요청 중 버튼 비활성화(`disabled`)로 중복 클릭 방지
- 응답 성공 후 Context 상태 갱신 (낙관적 업데이트 없음)

### NoteList 상단 — 필터 탭

- `NoteSearch` 아래, 노트 목록 위에 "전체 / 즐겨찾기" 탭 배치
- 탭 상태는 `App`의 `filterMode: 'all' | 'favorite'`로 관리
- "즐겨찾기" 탭 선택 시 `isFavorite: true`인 노트만 표시
- 필터 탭과 검색(`searchQuery`)은 독립적으로 동작 — 즐겨찾기 탭에서도 검색 가능
- 탭 전환 시 선택된 노트(`selectedNoteId`) 초기화

### 빈 상태 메시지

- "즐겨찾기" 탭에 해당 노트가 없을 때 → "즐겨찾기한 노트가 없습니다"
- 검색어와 함께 결과 없을 때 → "검색 결과가 없습니다" (기존 메시지 재사용)

---

## 변경 파일 목록

| 파일                           | 변경 내용                                                  |
| ------------------------------ | ---------------------------------------------------------- |
| `src/types/note.ts`            | `isFavorite: boolean` 필드 추가                            |
| `src/api/notes.ts`             | `createNote` 기본값에 `isFavorite: false` 추가             |
| `src/components/NoteItem.tsx`  | 즐겨찾기 버튼 추가, `onFavorite` prop 추가                 |
| `src/components/NoteList.tsx`  | 필터 탭 UI 추가, `filterMode` prop 추가                    |
| `src/App.tsx`                  | `filterMode` 상태 추가, `handleToggleFavorite` 핸들러 추가 |
| `src/context/NotesContext.tsx` | 변경 없음 (`updateNote`가 이미 Partial 업데이트)           |

---

## 엣지 케이스

### 토글 처리

| 상황                    | 처리                                        |
| ----------------------- | ------------------------------------------- |
| 토글 요청 중 재클릭     | 버튼 `disabled` 처리로 중복 요청 방지       |
| 토글 요청 실패          | 상태 변경 없이 유지, `console.error`로 출력 |
| 즐겨찾기 탭에서 해제 시 | 즉시 목록에서 사라짐 (필터 재적용)          |

### 필터 탭

| 상황                      | 처리                                               |
| ------------------------- | -------------------------------------------------- |
| 즐겨찾기 탭에 노트 없음   | "즐겨찾기한 노트가 없습니다" 메시지 표시           |
| 탭 전환 시                | `selectedNoteId` 초기화, 에디터 안내 화면으로 전환 |
| 즐겨찾기 탭 + 검색어 조합 | `isFavorite: true` 필터 후 검색어로 2차 필터링     |

### 데이터

| 상황                          | 처리                                          |
| ----------------------------- | --------------------------------------------- |
| 기존 노트에 `isFavorite` 없음 | `note.isFavorite ?? false` 로 기본값 처리     |
| 새 노트 생성                  | `isFavorite: false`로 POST                    |
| 즐겨찾기 상태에서 노트 삭제   | 삭제 후 목록에서 제거 (기존 삭제 로직과 동일) |
