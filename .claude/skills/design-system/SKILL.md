---
name: design-system
description: "디자인 시스템을 참고하여 스타일 작업을 수행하거나 결과물을 검사합니다. 컴포넌트 스타일링, 색상 적용, 레이아웃 작업, UI 수정 등 모든 스타일 관련 작업에서 반드시 이 스킬을 사용하세요. '스타일', '색상', 'UI', '컴포넌트 만들어', '디자인', 'Tailwind', 'className' 등의 요청에도 적극적으로 적용하세요."
---

# design-system

스타일 작업 시 `docs/design-system/`을 기반으로 구현하고,
완료 후 디자인 시스템 위반 여부를 검사한다.

---

## 단계 1: 작업 유형 파악 후 관련 파일 읽기

작업 유형에 따라 필요한 파일만 선택적으로 읽는다.

| 작업 유형             | 읽어야 할 파일                                                                        |
| --------------------- | ------------------------------------------------------------------------------------- |
| 색상 / 배경 / 보더    | `docs/design-system/tokens/color.md` + `docs/design-system/rules/color-usage.md`      |
| 타이포그래피 / 텍스트 | `docs/design-system/tokens/typography.md`                                             |
| 간격 / 레이아웃       | `docs/design-system/tokens/spacing.md` + `docs/design-system/rules/spacing-rhythm.md` |
| 그림자 / 깊이         | `docs/design-system/rules/elevation.md`                                               |
| 버튼                  | `docs/design-system/components/button.md`                                             |
| 카드 / 리스트         | `docs/design-system/components/card.md`                                               |
| 인풋 / 폼             | `docs/design-system/components/input.md`                                              |
| 태그 칩               | `docs/design-system/components/knowledge-token.md`                                    |
| 전체 컴포넌트 제작    | `docs/design-system/index.md` 읽고 필요한 파일 추가 선택                              |

**파일이 아직 존재하지 않으면** `docs/design-system/index.md`와 현재 존재하는 파일들을 읽고 진행한다.

---

## 단계 2: 스타일 작업 수행

읽은 디자인 시스템 문서를 기반으로 작업을 수행한다.

반드시 지켜야 할 핵심 원칙:

- `border`로 영역 구분 금지 → 배경색 전환 사용
- `box-shadow` 금지 → Tonal Layering 또는 Ambient Shadow 사용
- `#000000` 금지 → `on_surface` (#2b3437) 사용
- 리스트 구분선 금지 → `spacing.4` (1.4rem) 간격 사용
- 액센트 컬러(`tertiary` #0053dc)는 CTA·포커스에만 사용

---

## 단계 3: 완료 후 자동 검사

작업이 끝나면 수정된 파일을 읽고 아래 항목을 검사한다.

### 색상 검사

- [ ] `border: 1px solid` 또는 `border-[색상]` 클래스 사용 여부
- [ ] `shadow-` 클래스 또는 `box-shadow` 사용 여부 (플로팅 요소 제외)
- [ ] `text-black` / `#000000` 사용 여부
- [ ] 디자인 토큰 외 임의 색상값 사용 여부
- [ ] CSS 변수(`var(--color-*)`) 대신 색상값 하드코딩 여부 (`#2b3437`, `rgb(...)`, `bg-blue-600` 등)

### 타이포그래피 검사

- [ ] `label-md` 스타일 요소에 `uppercase` + `tracking-wide` 적용 여부
- [ ] 본문 텍스트에 `on_surface_variant` 색상 사용 여부

### 간격 검사

- [ ] 리스트 구분에 `divide-` 클래스 또는 `border-b` 사용 여부
- [ ] 섹션 간격이 `spacing.4` (1.4rem) 기준을 따르는지 여부

### 컴포넌트 검사

- [ ] 인풋에 레이블이 위에 배치되어 있는지 여부
- [ ] Primary 버튼이 한 화면에 하나인지 여부

---

## 단계 4: 검사 결과 리포트

위반 항목이 있으면 아래 형식으로 보고한다.

```
## 디자인 시스템 검사 결과

### ❌ 위반 항목
- [파일명:줄번호] 문제 설명 → 수정 방법

### ✅ 통과 항목
- 항목명

### 💡 수정 여부
자동으로 수정할까요?
```

위반 항목이 없으면:

```
✅ 디자인 시스템 검사 통과
```
