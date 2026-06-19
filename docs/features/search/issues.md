# 검색 기능 이슈 분해

수직 슬라이싱 원칙 적용: 각 이슈는 완료 후 사용자에게 보여줄 수 있는 동작 또는 검증 가능한 결과물이 존재한다.

의존 관계: `#1 → #2`, `#1 → #3`

---

## Issue 1: [검색] `useSearch` 훅 추출 및 리팩터링

### 설명

현재 검색 상태(`searchQuery`)가 App.tsx 로컬 state에 인라인으로 존재하고, 필터링 로직이 NoteList.tsx 내부에 있다.
이를 `src/hooks/useSearch.ts`로 추출해 ADR-1 결정을 코드에 반영한다.

변경 파일:

- 신규: `src/hooks/useSearch.ts`
- 수정: `src/App.tsx` — inline searchQuery 상태 제거, `useSearch(notes)` 호출로 교체
- 수정: `src/components/NoteList.tsx` — 내부 필터링 로직 제거, `notes` prop 수신으로 변경

### 완료 조건 (Acceptance Criteria)

- [ ] AC-1(훅 인터페이스): `useSearch(notes: Note[])`를 호출하면 `{ query: string, setQuery: (q: string) => void, filteredNotes: Note[] }` 형태의 객체를 반환한다
- [ ] AC-2(필터링 위치): 필터링 로직(title + content 포함 여부 검사, 대소문자 무시)이 NoteList.tsx 내부가 아닌 `src/hooks/useSearch.ts` 안에 있다
- [ ] AC-3(App 연결): App.tsx에서 `useNotes().notes`를 `useSearch`의 인자로 전달하고, 기존 `searchQuery` 인라인 useState를 제거한다
- [ ] AC-4(NoteList 인터페이스): NoteList.tsx props에서 `searchQuery` prop을 제거하고 `notes: Note[]` prop을 추가해 외부(App)에서 필터된 배열을 주입받는다
- [ ] AC-5(동작 유지): `npm run dev` 실행 후 검색창에 키워드 입력 시 제목·본문 기준 실시간 필터링이 기존과 동일하게 동작한다
- [ ] AC-6(named export): 훅이 `src/hooks/useSearch.ts`에 `export function useSearch` 형태의 named export로 작성된다
- [ ] AC-7(TypeScript 컴파일): `npm run build` 시 `useSearch` 관련 TypeScript 타입 오류가 없다

### 시나리오

**시나리오 A — 키워드 검색**

**Given** 노트 3개가 있고 그 중 1개의 본문에 "리액트"가 포함됨  
**When** 검색창에 "리액트" 입력  
**Then** 해당 노트 1개만 목록에 표시됨

**시나리오 B — 검색 초기화**

**Given** "리액트"를 검색해 1개만 표시된 상태  
**When** 검색창을 비움  
**Then** 전체 노트 3개가 다시 표시됨

---

## Issue 2: [검색] `useSearch` 훅 단위 테스트

### 설명

Issue 1에서 추출한 `useSearch` 훅의 필터링 로직을 `renderHook`으로 독립 검증한다.
컴포넌트 없이 훅만 테스트하므로 빠르고 명확하다.

신규 파일: `src/hooks/useSearch.test.ts`

의존: #1

### 완료 조건 (Acceptance Criteria)

- [ ] AC-1(빈 query 전체 반환): 초기 `query`가 빈 문자열일 때 `filteredNotes`가 입력한 `notes` 배열의 모든 항목을 포함한다
- [ ] AC-2(title 필터링): `act(() => setQuery('리액트'))` 호출 후 `filteredNotes`에 title에 "리액트"가 포함된 노트만 남고, 포함되지 않은 노트는 제외된다
- [ ] AC-3(content 필터링): `act(() => setQuery('hooks'))` 호출 후 `filteredNotes`에 content에 "hooks"가 포함된 노트만 남고, title에만 매칭되는 노트는 제외된다
- [ ] AC-4(대소문자 무시): `act(() => setQuery('react'))` 호출 시 title 또는 content에 "React", "REACT", "react" 등 대소문자 무관하게 포함된 노트가 `filteredNotes`에 모두 포함된다
- [ ] AC-5(0건 반환): 어떤 노트의 title·content에도 포함되지 않는 쿼리를 입력하면 `filteredNotes`가 빈 배열(`[]`)이다
- [ ] AC-6(query 갱신 반영): `setQuery('A')` 후 `setQuery('B')`를 연속 호출하면 최종 `filteredNotes`가 'B' 기준으로 필터링된 결과를 반환한다
- [ ] AC-7(부분 문자열 매칭): query가 "React"일 때 title이 "React Hooks 심화"인 노트도 `filteredNotes`에 포함된다 (완전 일치가 아닌 부분 문자열 검색)
- [ ] AC-8(title·content 중복 방지): title과 content 모두에 query가 포함된 노트는 `filteredNotes`에 1번만 포함된다
- [ ] AC-9(빈 notes 배열): `notes`가 빈 배열일 때 query에 상관없이 `filteredNotes`가 빈 배열이다
- [ ] AC-10(초기 query 값): 훅 초기화 직후 `query`가 빈 문자열(`''`)이다

### 시나리오

**시나리오 A — title 필터링**

**Given** `[{ title: "React 입문", content: "기초 내용" }, { title: "TypeScript", content: "타입 시스템" }]`  
**When** `act(() => result.current.setQuery("React"))` 호출  
**Then** `result.current.filteredNotes`가 `[{ title: "React 입문", ... }]` 1개

**시나리오 B — content 필터링**

**Given** `[{ title: "노트1", content: "react hooks 사용법" }, { title: "노트2", content: "다른 내용" }]`  
**When** `act(() => result.current.setQuery("hooks"))` 호출  
**Then** `result.current.filteredNotes`가 첫 번째 노트 1개

**시나리오 C — 대소문자 무시**

**Given** `[{ title: "React", content: "" }, { title: "react", content: "" }, { title: "Vue", content: "" }]`  
**When** `act(() => result.current.setQuery("react"))` 호출  
**Then** `result.current.filteredNotes.length === 2` (대소문자 무관 2개 포함)

**시나리오 D — 빈 query**

**Given** notes 3개, 초기 렌더링  
**When** `query`가 빈 문자열인 상태 확인  
**Then** `result.current.filteredNotes.length === 3`

---

## Issue 3: [검색] NoteList · NoteSearch 컴포넌트 테스트

### 설명

Issue 1에서 인터페이스가 변경된 NoteList와 기존 NoteSearch 컴포넌트의 렌더링 동작을 검증한다.

신규 파일:

- `src/components/NoteList.test.tsx`
- `src/components/NoteSearch.test.tsx`

의존: #1

### 완료 조건 (Acceptance Criteria)

- [ ] AC-1(목록 렌더링): `notes` prop에 title이 각각 "노트A", "노트B"인 2개 노트를 전달하면 두 제목이 화면에 표시된다
- [ ] AC-2(노트 개수 표시): `notes` prop에 3개 노트를 전달하면 "노트 3개" 텍스트가 화면에 표시된다
- [ ] AC-3(빈 배열 안내): `notes` prop에 빈 배열(`[]`)을 전달하면 "노트가 없습니다" 텍스트가 화면에 표시된다
- [ ] AC-4(로딩 상태): NotesContext mock에서 `loading: true`를 주입하면 "로딩 중..." 텍스트가 화면에 표시되고 노트 목록은 렌더링되지 않는다
- [ ] AC-5(에러 상태): NotesContext mock에서 `error: "서버 오류"`를 주입하면 "오류: 서버 오류" 텍스트가 화면에 표시된다
- [ ] AC-6(노트 선택): 특정 NoteItem 클릭 시 `onSelect`가 해당 노트의 id를 인자로 1회 호출된다
- [ ] AC-7(선택된 노트 강조): `selectedNoteId`와 일치하는 id를 가진 NoteItem이 선택 스타일(구분 가능한 클래스)로 렌더링된다
- [ ] AC-8(삭제 버튼): 노트 목록에 삭제 버튼이 렌더링되고, 클릭 시 `deleteNote`가 해당 노트의 id를 인자로 1회 호출된다
- [ ] AC-9(NoteSearch value 반영): NoteSearch에 `value="검색어"` prop을 전달하면 `screen.getByRole('textbox')`의 value가 "검색어"이다
- [ ] AC-10(NoteSearch placeholder): NoteSearch 렌더링 시 input의 placeholder 속성이 "검색..."이다
- [ ] AC-11(NoteSearch onChange 호출): NoteSearch의 input에 `userEvent.type(input, "리액트")`를 실행하면 `onChange`가 마지막 문자 입력 시점에 "리액트"를 인자로 호출된다

### 시나리오

**시나리오 A — NoteList 필터된 목록 렌더링**

**Given** `notes` prop으로 title이 "노트A", "노트B"인 2개 노트 전달  
**When** NoteList 렌더링  
**Then** "노트A"와 "노트B" 텍스트가 모두 화면에 존재하고, "노트 2개" 텍스트도 표시됨

**시나리오 B — NoteList 빈 배열**

**Given** `notes` prop으로 빈 배열 전달, loading·error 없음  
**When** NoteList 렌더링  
**Then** "노트가 없습니다" 텍스트가 화면에 존재하고 NoteItem은 0개 렌더링됨

**시나리오 C — NoteSearch onChange**

**Given** NoteSearch 렌더링, `onChange` jest.fn() 전달, `value=""`  
**When** input에 "리액트" 입력  
**Then** `onChange`가 "리액트"를 포함한 인자로 호출됨
