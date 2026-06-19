# 검색 기능 PRD

## 1. 개요

노트를 많이 쌓아둔 사용자가 특정 내용을 찾을 수 있도록, 제목·본문 대상 실시간 필터링 검색을 제공한다.
검색 상태는 독립 훅(`useSearch`)으로 분리해 향후 태그·즐겨찾기 복합 필터와 조합 가능하도록 설계한다.

## 2. 사용자 스토리

- 사용자로서, 사이드바 상단 검색창에 키워드를 입력하면 제목·본문이 일치하는 노트만 목록에 보고 싶다.
- 사용자로서, 검색어를 지우면 전체 노트 목록으로 돌아오고 싶다.
- 사용자로서, 검색 결과가 없을 때 명확한 안내 메시지를 보고 싶다.

## 3. 기술 결정

### ADR-1. 검색 상태 및 필터링 로직 위치

**Context** — 현재 `searchQuery` 상태가 App.tsx 로컬 state에 인라인으로 존재하고, 필터링 로직이 NoteList 안에 있다. spec에서 "향후 태그·즐겨찾기 복합 필터와 조합 가능하도록 독립 훅으로 분리"를 결정했으므로 구조를 정비해야 한다.

**Decision** — `src/hooks/useSearch.ts`를 신규 생성한다. `useSearch(notes: Note[])` 형태로 notes 배열을 입력받아 `{ query, setQuery, filteredNotes }`를 반환한다. 필터링 로직(title + content 대소문자 무시)을 훅 안으로 이동한다. App.tsx는 `useNotes()`로 notes를 가져온 뒤 `useSearch(notes)`를 호출하고, NoteList는 `filteredNotes`를 prop으로 받는다.

**Alternatives**

- **안 1 (`useSearch()` — query만)**: 필터링 로직이 NoteList에 잔존해 훅 단위 독립 테스트 불가. 향후 복합 필터 조합 시 App을 다시 수정해야 함 → 거부.
- **안 3 (`useNoteSearch()` — Context 내장)**: 훅 내부에서 `useNotes()`를 호출해 편리하지만, Context에 결합되어 Provider 없이 테스트 불가. 복합 필터 조합 시 훅 구조를 다시 뜯어야 함 → 거부.

**Consequences**

- ✅ `renderHook(() => useSearch(mockNotes))`로 필터링 로직을 컴포넌트 없이 독립 테스트 가능
- ✅ `useSearch(notes)`가 순수 변환(notes → filteredNotes)이라 향후 `useTagFilter(notes)` 등과 체인 조합 용이
- ⚠️ NoteList의 prop 인터페이스 변경 필요 — `searchQuery` prop 제거, `notes` prop 추가(또는 Context 직접 구독 방식 유지하되 filteredNotes를 외부에서 주입)
- ⚠️ App.tsx에서 `useNotes()`와 `useSearch(notes)`를 순서대로 호출해야 하므로 NotesProvider 안에서만 사용 가능

## 4. Out of Scope

- 검색어 하이라이팅
- 검색 히스토리
- 태그·즐겨찾기 복합 필터 (향후 확장 대상)
- 서버 사이드 검색
- debounce
- 정규식·고급 검색 문법

## 5. 용어 정의

| 용어               | 정의                                             |
| ------------------ | ------------------------------------------------ |
| **검색어 (query)** | 사용자가 검색창에 입력한 문자열                  |
| **필터링**         | 클라이언트에서 notes 배열을 검색어로 좁히는 동작 |
| **빈 검색**        | 검색어가 빈 문자열인 상태 → 전체 노트 표시       |
| **검색 상태**      | 현재 검색어를 담는 상태. 독립 훅으로 관리        |
