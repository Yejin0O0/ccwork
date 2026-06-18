# 태그 기능 이슈 분해

수직 슬라이싱 원칙 적용: 각 이슈는 타입 → 로직 → UI → 저장까지 전 레이어를 관통하며 독립적으로 동작 가능한 단위로 분해한다.

의존 관계: `#1 → #2`, `#1 → #3`, `#1 + #2 → #4`

---

## Issue 1: [태그] 태그 입력 및 칩 표시 — 기본 추가·저장 흐름

### 설명

사용자가 NoteEditor에서 태그를 입력하고 Enter 또는 쉼표(`,`)로 추가하면 칩(chip) 형태로 표시되며, 저장 버튼 클릭 시 노트와 함께 서버에 저장된다. `Note` 타입에 `tags` 필드를 추가하고, `useTagEditor` 커스텀 훅과 `TagInput` 컴포넌트를 신규 생성해 NoteEditor에 통합한다.

파일 구조:

- `src/types/note.ts` — `tags: string[]` 필드 추가
- `src/api/notes.ts` — `createNote` / `updateNote`에 tags 전달
- `src/hooks/useTagEditor.ts` — 태그 상태·addTag·removeTag 로직, 소문자 정규화
- `src/components/TagInput.tsx` — 입력 필드 + 칩 렌더링
- `src/components/NoteEditor.tsx` — 훅·컴포넌트 통합

### 완료 조건 (Acceptance Criteria)

- [ ] `Note` 인터페이스에 `tags: string[]` 필드가 추가된다
- [ ] `tags`가 없는 기존 노트를 불러와도 에러 없이 렌더링된다 (기본값 `[]`)
- [ ] `api.createNote` / `api.updateNote` 호출 시 `tags` 배열이 요청 바디에 포함된다
- [ ] `useTagEditor(initialTags)` 훅이 `{ tags, addTag, removeTag, inputValue, setInputValue }`를 반환한다
- [ ] `TagInput` 컴포넌트가 입력 필드와 칩 목록을 렌더링한다
- [ ] NoteEditor 편집 폼에 TagInput이 포함된다
- [ ] Enter 또는 쉼표(`,`) 입력 시 태그가 추가되고 입력창이 초기화된다
- [ ] 대문자 입력은 소문자로 정규화되어 추가된다 (`React` → `react`)
- [ ] 빈 문자열 또는 공백만 입력 후 Enter 시 아무 반응 없이 무시된다 (shake 없음)
- [ ] 추가된 태그가 칩 형태로 즉시 표시된다
- [ ] 저장 버튼 클릭 시 `tags` 배열이 포함된 상태로 저장된다
- [ ] 노트를 다시 선택했을 때 저장된 태그 칩이 표시된다
- [ ] 태그를 수정하지 않고 제목·내용만 수정한 뒤 저장해도 기존 태그가 보존된다

### 시나리오

**시나리오 A — Enter로 태그 추가**

**Given** 노트 편집 화면이 열리고 TagInput이 렌더링된 상태  
**When** 사용자가 "frontend"를 입력하고 Enter를 누름  
**Then** "frontend" 칩이 칩 목록에 나타나고 입력창은 비워진다

**시나리오 B — 쉼표로 태그 추가**

**Given** TagInput 입력창에 포커스가 있는 상태  
**When** 사용자가 "react,"를 입력  
**Then** "react" 칩이 추가되고 쉼표는 입력창에 남지 않는다

**시나리오 C — 소문자 정규화**

**Given** TagInput에 "TypeScript"를 입력한 상태  
**When** Enter를 누름  
**Then** "typescript" 칩이 추가된다

**시나리오 D — 빈 입력창 Enter 무시**

**Given** TagInput 입력창이 비어 있는 상태  
**When** Enter를 누름  
**Then** 아무것도 추가되지 않고 shake도 발생하지 않으며 입력창은 그대로다

**시나리오 E — 태그 포함 저장**

**Given** "react", "hooks" 두 칩이 표시된 상태  
**When** 저장 버튼을 클릭  
**Then** PATCH 요청 바디에 `{ "tags": ["react", "hooks"] }`가 포함되어 전송된다

**시나리오 F — 기존 태그 복원**

**Given** `tags: ["react"]`로 저장된 노트  
**When** 해당 노트를 NoteEditor로 열었을 때  
**Then** "react" 칩이 이미 표시된 상태로 편집 화면이 열린다

**시나리오 G — 태그 미수정 후 저장 시 기존 태그 보존**

**Given** `tags: ["react"]`로 저장된 노트를 열고 제목만 수정한 상태  
**When** 저장 버튼을 클릭  
**Then** PATCH 요청 바디에 `{ "tags": ["react"] }`가 그대로 포함되어 기존 태그가 보존된다

**시나리오 H — 기존 태그가 있을 때 새 태그 추가**

**Given** "react" 칩이 이미 표시된 상태  
**When** "hooks"를 입력하고 Enter를 누름  
**Then** "react", "hooks" 두 칩이 모두 표시된다

---

## Issue 2: [태그] 칩에서 태그 삭제

### 설명

사용자가 칩의 × 버튼을 클릭해 개별 태그를 제거할 수 있다. 삭제는 즉시 UI에 반영되며, 저장 버튼 클릭 전까지는 서버에 반영되지 않는다.

### 완료 조건 (Acceptance Criteria)

- [ ] 각 칩에 삭제(×) 버튼이 표시된다
- [ ] × 버튼 클릭 시 해당 태그 칩이 즉시 제거된다
- [ ] 삭제 후 저장 시 제거된 태그가 포함되지 않은 상태로 저장된다
- [ ] 삭제는 저장 전에는 서버에 반영되지 않는다 (낙관적 업데이트 없음)

### 시나리오

**시나리오 A — 단일 태그 삭제**

**Given** "react", "typescript" 두 칩이 표시된 상태  
**When** "react" 칩의 × 버튼을 클릭  
**Then** "react" 칩이 즉시 사라지고 "typescript" 칩만 남는다

**시나리오 B — 삭제 후 저장**

**Given** "typescript" 칩만 남은 상태  
**When** 저장 버튼을 클릭  
**Then** PATCH 요청 바디에 `{ "tags": ["typescript"] }`만 포함되어 전송된다

**시나리오 C — 전체 태그 삭제 후 저장**

**Given** 모든 칩을 × 버튼으로 제거한 상태  
**When** 저장 버튼을 클릭  
**Then** PATCH 요청 바디에 `{ "tags": [] }`가 포함되어 전송된다

---

## Issue 3: [태그] 유효성 검사 및 shake 피드백

### 설명

잘못된 태그 입력 시 입력창 shake 애니메이션으로 즉각적인 피드백을 제공한다. 4가지 거부 규칙을 `useTagEditor` 훅에 구현한다. (ADR-02, ADR-03 구현)

거부 규칙 (shake 발생):

1. 15자 초과
2. 허용 문자 위반 (소문자·한글·숫자·하이픈 외)
3. 중복 태그

### 완료 조건 (Acceptance Criteria)

- [ ] 15자 초과 입력 후 Enter 시 shake 애니메이션이 재생되고 태그가 추가되지 않는다
- [ ] 허용되지 않는 문자(`!`, `@`, `.`, 공백 등) 포함 입력 후 Enter 시 shake가 재생되고 거부된다
- [ ] 이미 존재하는 태그와 동일한 값 입력 후 Enter 시 shake가 재생되고 거부된다
- [ ] shake 애니메이션은 짧게 완료되고 이후 다시 입력 가능한 상태로 복귀된다

### 시나리오

**시나리오 A — 15자 초과 거부**

**Given** TagInput에 16자 문자열을 입력한 상태  
**When** Enter를 누름  
**Then** 입력창이 shake 애니메이션을 재생하고 태그는 추가되지 않는다

**시나리오 B — 허용 문자 위반**

**Given** TagInput에 "react!!"를 입력한 상태  
**When** Enter를 누름  
**Then** 입력창이 shake 애니메이션을 재생하고 태그는 추가되지 않는다

**시나리오 C — 중복 거부**

**Given** "react" 칩이 이미 존재하는 상태  
**When** "react"를 입력하고 Enter를 누름  
**Then** 입력창이 shake 애니메이션을 재생하고 중복 태그는 추가되지 않는다

---

## Issue 4: [태그] 최대 10개 제한 UX

### 설명

태그가 10개에 도달하면 입력창을 비활성화하고 안내 문구를 표시한다. 태그 삭제 후에는 자동으로 입력창이 활성화된다. "잘못된 입력"이 아니라 "현재 추가 불가 상태"임을 명확히 전달한다. (ADR-04 구현)

### 완료 조건 (Acceptance Criteria)

- [ ] 태그가 10개일 때 입력창이 `disabled` 처리된다
- [ ] 태그가 10개일 때 "태그는 최대 10개까지 추가할 수 있습니다" 안내 문구가 표시된다
- [ ] 태그를 삭제해 9개 이하가 되면 입력창이 다시 활성화되고 안내 문구가 사라진다
- [ ] `disabled` 상태에서는 Enter / 쉼표 입력이 동작하지 않는다

### 시나리오

**시나리오 A — 10개 도달 시 비활성화**

**Given** 태그가 이미 10개 추가된 상태  
**When** NoteEditor의 TagInput을 확인  
**Then** 입력창이 비활성화(disabled)되고 "태그는 최대 10개까지 추가할 수 있습니다" 문구가 표시된다

**시나리오 B — 삭제 후 재활성화**

**Given** 태그가 10개이고 입력창이 비활성화된 상태  
**When** 칩 하나의 × 버튼을 클릭해 태그를 삭제  
**Then** 입력창이 다시 활성화되고 안내 문구가 사라진다

**시나리오 C — disabled 상태에서 키 입력 무반응**

**Given** 태그가 10개이고 입력창이 disabled인 상태  
**When** 사용자가 키보드로 입력을 시도  
**Then** 입력창에 아무것도 입력되지 않고 태그도 추가되지 않는다
