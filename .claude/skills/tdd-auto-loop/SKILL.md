---
name: tdd-auto-loop
description: GitHub 이슈 번호를 받아 7단계 TDD 사이클을 사용자 개입 없이 완주한다. 각 단계는 격리된 subagent로 실행되며, STOP 감지 시 이슈에 코멘트를 남기고 루프를 종료한다.
---

# tdd-auto-loop

GitHub 이슈 하나를 사용자 개입 없이 끝까지 처리하는 완전 자동 TDD 오케스트레이터.
각 단계는 Task tool로 격리된 subagent에서 실행한다. 메인은 JSON 결과만 수신한다.

## 입력

`$ARGUMENTS` — GitHub 이슈 번호 (예: `17`)

---

## 진행 출력

단계 완료 시 한 줄만 출력한다:

```
[사전점검] OK
[test-scenarios] OK
[tdd-red] OK
[tdd-green] OK (attempt 1)
[ac-verifier] OK
[tdd-refactor] OK
[security-review] OK
[create-pr] OK → https://github.com/.../pull/N
```

STOP 시:

```
[단계명] STOP(사유)
```

---

## JSON Schema

각 subagent는 아래 schema 중 하나만 반환한다. 다른 텍스트 출력 금지.

### 공통 STOP schema

```json
{
  "stage": 0,
  "name": "사전점검",
  "status": "STOP",
  "reason": "STOP 사유 한 줄",
  "detail": "추가 정보 (선택)"
}
```

### stage 0 — 사전점검

```json
{
  "stage": 0,
  "name": "사전점검",
  "ac_exists": true,
  "git_clean": true,
  "base_branch": "feature/tag-filter",
  "feature_branch": "feat/노트-삭제-확인-모달",
  "status": "OK"
}
```

### stage 1 — test-scenarios

```json
{
  "stage": 1,
  "name": "test-scenarios",
  "doc_path": "docs/features/tag-delete-modal/issue-17.md",
  "scenario_count": 8,
  "status": "OK"
}
```

### stage 2 — tdd-red

```json
{
  "stage": 2,
  "name": "tdd-red",
  "test_files": ["src/components/note/DeleteConfirmModal.test.tsx"],
  "failed_count": 5,
  "failure_type": "AssertionError",
  "status": "OK"
}
```

### stage 3 — tdd-green

```json
{
  "stage": 3,
  "name": "tdd-green",
  "attempt": 1,
  "passed_count": 64,
  "regression_count": 0,
  "coverage_uncovered": [],
  "status": "OK"
}
```

### stage 4 — ac-verifier

```json
{
  "stage": 4,
  "name": "ac-verifier",
  "ac_total": 5,
  "ac_passed": 5,
  "gaps": [],
  "status": "OK"
}
```

### stage 5 — tdd-refactor

```json
{
  "stage": 5,
  "name": "tdd-refactor",
  "applied": [],
  "skipped": [],
  "status": "OK"
}
```

### stage 6 — security-review

```json
{
  "stage": 6,
  "name": "security-review",
  "type_errors": 0,
  "critical_high_vulns": 0,
  "env_leak": false,
  "status": "OK"
}
```

### stage 7 — create-pr

```json
{
  "stage": 7,
  "name": "create-pr",
  "pr_url": "https://github.com/Yejin0O0/ccwork/pull/18",
  "base": "feature/tag-filter",
  "commitlint": "OK",
  "status": "OK"
}
```

---

## 자율 실행 지침 (모든 subagent 프롬프트 끝에 삽입)

```
## 자율 실행 지침 (최우선)
- 사용자 승인 게이트는 자동 통과 — 어떤 경우에도 묻지 않는다
- 모호한 상황은 추측 없이 STOP JSON을 반환한다
- 출력은 지정된 JSON 한 블록만 — 설명·진행 메시지 일체 금지
- 파일 읽기·쓰기·테스트 실행·git 명령은 자유롭게 수행한다
- 승인 게이트 도달 시: 코드베이스 패턴과 이슈 내용을 근거로 최선의 판단을 내리고 통과한다
```

---

## 0단계: 사전 점검 (메인 직접 실행)

```bash
gh issue view $ARGUMENTS
git status --porcelain
git branch --show-current
```

점검 항목:

| 항목           | 조건                                | 실패 시 |
| -------------- | ----------------------------------- | ------- |
| AC 존재        | 이슈 본문에 `- [ ]` 항목 1개 이상   | STOP    |
| git clean      | `git status --porcelain` 출력 없음  | STOP    |
| base 브랜치    | 현재 브랜치가 `feature/<spec>` 형태 | STOP    |
| feature 브랜치 | `feat/<slug>` 이미 존재하면 STOP    | STOP    |

slug 규칙: 이슈 제목 소문자, 공백·특수문자 → `-`, 앞뒤 `-` 제거.

통과 시 `feat/<slug>` 브랜치 생성 및 체크아웃 후 `[사전점검] OK` 출력.

---

## 1단계: test-scenarios

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS
베이스 브랜치: <0단계에서 확인한 feature/<spec>>

.claude/skills/test-scenarios/SKILL.md 를 읽고 지침을 따라 이슈 $ARGUMENTS의
시그니처와 시나리오를 작성하라.

- GitHub 이슈: gh issue view $ARGUMENTS
- PRD 참조: docs/features/<spec>/prd.md (있으면)
- 결과 저장: docs/features/<spec>/issue-$ARGUMENTS.md

[자율 실행 지침]
```

STOP 조건: `doc_path` 파일이 생성되지 않은 경우.

---

## 2단계: tdd-red

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS
시나리오 파일: <1단계 doc_path>

.claude/skills/tdd-red/SKILL.md 를 읽고 지침을 따라 실패 테스트를 작성하라.
모든 it 블록은 AssertionError로 실패해야 한다.

[자율 실행 지침]
```

STOP 조건: `failure_type != "AssertionError"` 또는 `failed_count == 0`.

---

## 3단계: tdd-green (최대 3회)

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS
attempt: <현재 시도 횟수>

.claude/skills/tdd-green/SKILL.md 를 읽고 지침을 따라 최소 구현으로
모든 테스트를 통과시켜라. 회귀가 없어야 한다.

[자율 실행 지침]
```

- `status == "OK"` → 4단계 진행
- `status == "STOP"` && attempt < 3 → attempt+1로 재시도
- attempt == 3에서도 STOP → 루프 종료

---

## 4단계: ac-verifier

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS

이 agent는 Green을 수행한 agent와 독립적이다.
GitHub 이슈 $ARGUMENTS 의 AC를 읽고 현재 구현이 각 AC를 실제로 충족하는지 검증하라.
테스트 통과 ≠ AC 충족임을 주의하라.

검증 방법:
1. gh issue view $ARGUMENTS 로 AC 목록 확인
2. 테스트 코드와 프로덕션 코드를 읽어 각 AC의 동작 확인
3. gaps 배열에 미충족 AC를 나열하라

[자율 실행 지침]
```

STOP 조건: `ac_passed < ac_total`.

---

## 5단계: tdd-refactor

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS

.claude/skills/tdd-refactor/SKILL.md 를 읽고 지침을 따라 구조를 개선하라.
테스트가 깨지는 변경은 즉시 롤백한다.

[자율 실행 지침]
```

STOP 조건: 롤백 후에도 테스트 실패 지속.

---

## 6단계: security-review

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS

.claude/skills/security-review/SKILL.md 를 읽고 지침을 따라 타입 오류와
보안 취약점을 점검하라.
즉시 수정 필요 항목은 수정 후 재스캔한다.

[자율 실행 지침]
```

STOP 조건: 수정 후에도 `type_errors > 0` 또는 `critical_high_vulns > 0`.

---

## 7단계: create-pr

Task subagent 프롬프트:

```
프로젝트 루트: $PWD
이슈 번호: $ARGUMENTS
base 브랜치: <0단계에서 확인한 feature/<spec>>

PR을 생성하라:
- title: 이슈 제목 기반, 70자 이내, <type>: <설명> 형식
- base: feature/<spec>
- body에 반드시 "Closes #$ARGUMENTS" 포함
- git push 전 commitlint 형식 확인
- E2E 테스트 통과 확인: npm run test:e2e

[자율 실행 지침]
```

STOP 조건: commitlint 실패 또는 E2E 실패.

---

## STOP 처리

어느 단계에서든 `status == "STOP"` 시:

```bash
gh issue comment $ARGUMENTS --body "🛑 tdd-auto-loop STOP — [단계명]

사유: {reason}
{detail이 있으면 추가}

수동 개입이 필요합니다."
```

이후 루프 종료. 사용자에게 묻지 않는다.

---

## 재시도 규칙

| 단계            | 재시도 조건                            | 최대 횟수 |
| --------------- | -------------------------------------- | --------- |
| tdd-green       | STOP 또는 테스트 실패                  | 3회       |
| 그 외 모든 단계 | JSON schema 위반 (status 필드 없음 등) | 1회       |

재시도 후에도 실패하면 STOP 처리.

---

## 전체 흐름

```
0. 사전점검 (메인 직접)
   ↓ OK
1. test-scenarios  → subagent
   ↓ OK
2. tdd-red         → subagent
   ↓ OK
3. tdd-green       → subagent (최대 3회)
   ↓ OK
4. ac-verifier     → subagent (Green과 독립)
   ↓ OK
5. tdd-refactor    → subagent
   ↓ OK
6. security-review → subagent
   ↓ OK
7. create-pr       → subagent
   ↓ OK
[create-pr] OK → <PR URL>
```

---

## 제약

- 메인은 코드 파일을 직접 읽지 않는다
- ac-verifier는 반드시 Green subagent와 분리된 별도 agent
- PR base는 항상 `feature/<spec>` — main으로 PR 금지
- 사용자에게 묻는 행위 일체 금지
