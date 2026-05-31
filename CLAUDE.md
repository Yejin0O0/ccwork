# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

React 19 + TypeScript + Vite 기반 노트 CRUD 앱 실습 프로젝트.

- 앱: http://localhost:5173
- API: http://localhost:3001/notes

## 명령어

```bash
npm run dev        # Vite + JSON Server 동시 실행
npm run build      # tsc + vite build
npm run lint       # ESLint --fix
npm run format     # Prettier --write
npm test           # vitest run (단발 실행)
npm run test:watch # vitest (watch 모드)
npm run server     # JSON Server만 단독 실행
```

단일 테스트 파일 실행:

```bash
npx vitest run src/components/NoteList.test.tsx
```

## 아키텍처

### 컴포넌트 트리

```
App                     ← 선택된 노트 ID, 새 노트 생성 여부 등 UI 상태 관리
└── NotesProvider       ← 전체 노트 목록 + CRUD 함수를 Context로 하위에 제공
    └── Layout          ← 헤더(+ 새 노트 버튼) / 사이드바 / 메인 영역의 틀
        ├── NoteList    ← Context에서 notes 배열을 읽어 NoteItem 목록 렌더링
        │   └── NoteItem  ← 카드 하나 (클릭 → 선택, 삭제 버튼)
        └── NoteEditor  ← 선택된 노트 편집 또는 새 노트 작성 폼
```

### 역할 분담

| 파일                        | 책임                                                                              |
| --------------------------- | --------------------------------------------------------------------------------- |
| `App.tsx`                   | `selectedNoteId`, `isCreating` 상태 소유. 사이드바와 에디터를 Layout에 조립       |
| `context/NotesContext.tsx`  | 앱 전체에서 공유하는 notes 배열 + `createNote` / `updateNote` / `deleteNote` 액션 |
| `api/notes.ts`              | JSON Server와 통신하는 fetch 함수만 모아 둔 파일                                  |
| `components/Layout.tsx`     | 레이아웃 껍데기. 어떤 컴포넌트를 넣을지는 App에서 결정                            |
| `components/NoteList.tsx`   | Context에서 notes를 읽어 목록 렌더링. 로딩·에러 상태 처리 포함                    |
| `components/NoteItem.tsx`   | 단일 노트 카드. 선택 여부(isSelected)에 따라 테두리 강조                          |
| `components/NoteEditor.tsx` | selectedNoteId/isCreating prop을 보고 편집 폼 또는 안내 화면 표시                 |

### 데이터 흐름

**읽기 (초기 로드)**
앱이 처음 열리면 `NotesProvider`의 `useEffect`가 `api.fetchNotes()`를 호출해 JSON Server에서 전체 노트를 가져온다. 응답이 오면 `notes` 배열 상태에 저장하고, 이후 `NoteList`가 이를 렌더링한다.

**생성**
"+ 새 노트" 버튼 클릭 → App이 `isCreating = true`로 전환 → NoteEditor에 빈 폼 표시 → 저장 버튼 클릭 → `createNote(title, content)` 호출 → `api.createNote`가 POST 요청 → JSON Server가 id를 붙여 응답 → Context가 응답받은 노트를 `notes` 배열 끝에 추가.

**수정**
NoteItem 클릭 → App이 `selectedNoteId` 갱신 → NoteEditor가 해당 노트 내용으로 폼 동기화 → 저장 버튼 클릭 → `updateNote(id, updates)` 호출 → `api.updateNote`가 PATCH 요청 → Context가 응답받은 노트로 배열 내 해당 항목 교체.

**삭제**
NoteItem의 삭제 버튼 클릭 → `deleteNote(id)` 호출 → `api.deleteNote`가 DELETE 요청 → 응답 성공 후 Context가 해당 id를 배열에서 제거.

> 낙관적 업데이트 없음: 서버 응답이 성공한 뒤에만 UI 상태를 변경한다.

## 백엔드 (JSON Server)

`json-server`가 `db.json` 파일을 감시하며 자동으로 REST API를 제공한다. 별도의 서버 코드 없이 JSON 파일 하나가 데이터베이스 역할을 한다.

| HTTP 메서드 | 엔드포인트   | 동작                        |
| ----------- | ------------ | --------------------------- |
| GET         | `/notes`     | 전체 목록 반환              |
| POST        | `/notes`     | 새 노트 생성 (id 자동 생성) |
| PATCH       | `/notes/:id` | 특정 노트 부분 수정         |
| DELETE      | `/notes/:id` | 특정 노트 삭제              |

`db.json`은 실제 데이터가 기록되는 파일이다. 노트를 추가/수정/삭제하면 파일 내용이 바뀌며, 서버를 재시작해도 데이터가 유지된다.

## 테스트 환경

| 항목              | 내용                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| 테스트 프레임워크 | Vitest (Jest 호환 API)                                                                         |
| 렌더링            | `@testing-library/react` — 컴포넌트를 실제 DOM에 마운트해 테스트                               |
| DOM 환경          | jsdom — 브라우저 없이 Node.js에서 DOM API를 사용할 수 있게 해줌                                |
| 추가 매처         | `@testing-library/jest-dom` — `toBeInTheDocument()` 등의 단언문 제공                           |
| 설정 파일         | `src/test-setup.ts` — jest-dom 매처를 전역 등록. `vite.config.ts`의 `test.setupFiles`에 연결됨 |

## 타입

`src/types/note.ts`의 `Note` 인터페이스 필드: `id`, `title`, `content`, `createdAt`, `updatedAt`.  
`tags` 필드는 아직 없으며 강의 진행 중 추가 예정이다.

## 구현 패턴

### 컴포넌트

- **export 방식**: 기본적으로 `export default`를 사용한다. 한 파일에서 여러 개를 export해야 하는 경우에만 named export를 사용한다.
- **Props 타입 선언**: 파일 상단에 `interface [컴포넌트명]Props` 형태로 정의하고 구조 분해 할당으로 받는다.
- **early return으로 예외 상태 처리**: 로딩 / 에러 / 빈 상태를 렌더 본문 앞에서 먼저 반환한다 (NoteList 참고).
- **스타일은 Tailwind 인라인 클래스로**: CSS 모듈, styled-components 없이 className에 직접 작성. 조건부 클래스는 템플릿 리터럴 + 삼항 연산자 패턴 사용.

### 상태 관리

- **계층별 상태 분리**: 서버 데이터(notes 배열, loading, error)와 CRUD 액션은 Context에, UI 흐름 상태(selectedNoteId, isCreating)는 App 로컬 state에, 폼 입력값(title, content, saving)은 각 컴포넌트 로컬 state에 둔다.
- **Context 액션은 async**: `createNote` / `updateNote` / `deleteNote`는 모두 서버 응답을 기다린 뒤 state를 갱신한다. 낙관적 업데이트 없음.
- **Context 안전 접근**: `useNotes()`는 Provider 밖에서 호출하면 즉시 에러를 던진다.

### API 호출

- **fetch 함수는 `src/api/notes.ts`에만**: 컴포넌트나 Context에 직접 `fetch`를 쓰지 않는다.
- **Context에서 namespace import 사용**: `import * as api from '../api/notes'` → `api.fetchNotes()` 형태로 호출.
- **`res.ok` 체크 후 throw**: 모든 API 함수에서 `if (!res.ok) throw new Error(...)` 패턴을 일관되게 사용.
- **타임스탬프는 클라이언트에서 생성**: `createdAt` / `updatedAt`을 서버가 아닌 `api.ts` 내부에서 `new Date().toISOString()`으로 설정한다.

### 네이밍

| 대상               | 규칙                          | 예시                                     |
| ------------------ | ----------------------------- | ---------------------------------------- |
| 컴포넌트 파일      | PascalCase                    | `NoteEditor.tsx`, `NoteItem.tsx`         |
| 비컴포넌트 파일    | camelCase                     | `notes.ts`, `note.ts`                    |
| 이벤트 핸들러 prop | `on[동작]`                    | `onSelect`, `onDelete`, `onDone`         |
| 이벤트 핸들러 함수 | `handle[동작]`                | `handleSelectNote`, `handleSave`         |
| 불리언 상태 / prop | `is` 접두사                   | `isCreating`, `isSelected`               |
| Context 액션       | `create/update/delete` + 명사 | `createNote`, `updateNote`, `deleteNote` |

## 디자인 시스템

모든 스타일 작업은 **`/design-system` 스킬을 사용**한다.
스킬이 자동으로 관련 디자인 시스템 파일을 읽고, 작업 후 위반 여부를 검사한다.

`.tsx` / `.css` 파일 수정 시 hook이 자동으로 실행되어 디자인 시스템 준수 여부를 상기시킨다.

| 파일                               | 내용                                  |
| ---------------------------------- | ------------------------------------- |
| `docs/design-system/index.md`      | 핵심 철학, 전체 Do/Don't              |
| `docs/design-system/colors.md`     | 색상 토큰, Surface 계층, No-Line Rule |
| `docs/design-system/typography.md` | 타입 스케일, 색상 조합                |
| `docs/design-system/elevation.md`  | Tonal Layering, 그림자, Ghost Border  |
| `docs/design-system/components.md` | 버튼, 카드, 인풋, Knowledge Token     |
| `docs/design-system/spacing.md`    | 간격 스케일, 수직 리듬                |

**핵심 원칙 요약**

- 영역 구분은 `border` 대신 배경색 차이로
- 그림자는 Tonal Layering으로 대체, 플로팅 요소에만 Ambient Shadow 허용
- 액센트 컬러(`tertiary` #0053dc)는 CTA·포커스에만 사용
- 리스트 구분선 금지 → `spacing.4` (1.4rem) 간격으로 대체

## 커밋 규칙

커밋 시 Husky가 자동으로 두 가지를 검사한다.

**1. pre-commit — 코드 품질 (lint-staged)**

- `*.ts`, `*.tsx` → ESLint --fix → Prettier --write
- `*.json`, `*.md`, `*.css` → Prettier --write

**2. commit-msg — 메시지 형식 (commitlint)**

```
<type>: <제목>        ← 필수
                      ← 빈 줄
<본문 첫째 줄>        ← 필수 (최소 2줄)
<본문 둘째 줄>        ← 필수
```

허용 타입: `feat` · `fix` · `refactor` · `docs` · `test` · `chore` · `style`

```bash
# ✅ 올바른 예
git commit -m "feat: 노트 검색 기능 추가" -m "검색 입력창 컴포넌트 추가
제목/내용 기준 필터링 구현"

# ❌ 차단되는 예 (타입 없음, 본문 없음)
git commit -m "검색 기능 추가"
```

설정 파일: `.husky/pre-commit`, `.husky/commit-msg`, `commitlint.config.mjs`

## 일관성 없는 패턴

**1. 에러 처리 방식 불일치**  
초기 데이터 로딩 실패는 Context의 `error` 상태에 저장되어 NoteList에서 렌더링된다. 반면 CRUD 액션(`createNote`, `updateNote`, `deleteNote`) 실패는 Context에서 잡지 않고 호출자에게 전파된다. NoteEditor는 try/catch로 잡아 `console.error()`로 출력하지만, NoteItem의 삭제 버튼은 `deleteNote` 에러를 전혀 처리하지 않는다.

**2. Layout.tsx의 인라인 style 사용**  
프로젝트 전체가 Tailwind를 사용하지만 `Layout.tsx`에만 `style={{ fontFamily: 'Boogaloo, sans-serif' }}`와 `style={{ height: 'calc(100vh - 65px)' }}`가 인라인으로 남아 있다. `--font-display` 변수가 `index.css`에 정의되어 있으나 Tailwind 유틸리티로 연결되지 않은 상태다.

## 주의 사항

**`npm run dev`를 사용해야 API가 동작한다**  
`npm run dev`는 Vite(프론트엔드 서버)와 JSON Server(API 서버)를 동시에 실행한다. Vite만 단독으로 실행하면 노트 목록을 불러오거나 저장할 수 없다.

**`db.json`은 실제 데이터가 저장되는 파일이다**  
앱을 통해 노트를 추가·수정·삭제하면 `db.json`이 직접 수정된다. 테스트 데이터를 초기화하려면 이 파일을 직접 편집해야 한다.

**API 주소가 코드에 고정되어 있다**  
`src/api/notes.ts` 상단의 `API_URL`이 `http://localhost:3001`로 하드코딩되어 있다. 포트를 변경하려면 이 파일과 `package.json`의 `server` 스크립트를 함께 수정해야 한다.

**TailwindCSS 설정 파일이 없는 것이 정상이다**  
TailwindCSS v4는 `tailwind.config.js` 없이 `src/index.css`의 `@theme { }` 블록에서 색상·폰트 등 디자인 토큰을 정의한다.
