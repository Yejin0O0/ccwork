# Design System: The Digital Atelier

## 핵심 철학

**The Curated Archive** — 노트 하나하나를 데이터가 아닌 개인 박물관의 소장품처럼 다룬다.

- **Soft Minimalism**: 콘텐츠가 UI와 경쟁하지 않도록 UI는 조용히 물러난다
- **Intentional Asymmetry**: 딱딱한 격자 대신, 여백과 색조 차이로 공간을 만든다
- **Tonal Depth**: 선(border)이 아닌 배경색 차이로 영역을 구분한다

---

## 디자인 시스템 구성

| 파일                             | 내용                                  |
| -------------------------------- | ------------------------------------- |
| [colors.md](./colors.md)         | 색상 토큰, Surface 계층, No-Line Rule |
| [typography.md](./typography.md) | 타입 스케일, 계층 구조                |
| [elevation.md](./elevation.md)   | Tonal Layering, 그림자, Ghost Border  |
| [components.md](./components.md) | 버튼, 카드, 인풋, Knowledge Token     |
| [spacing.md](./spacing.md)       | 간격 시스템, 수직 리듬                |

---

## Do / Don't

### ✅ Do

- 여백을 구조적 요소로 사용한다. 확신이 없으면 마진을 늘린다
- 색상 이동(`surface` → `surface_container_low`)으로 사이드바와 메인 영역을 구분한다
- 사이드바의 "선택됨" 상태는 `surface_container_highest`로 표현한다
- 액센트 컬러(`tertiary`)는 의도된 액션에만 아껴서 사용한다
- 입력 필드 레이블은 항상 인풋 위에 `label-md`로 배치한다
- **색상은 반드시 CSS 변수로만 사용한다** → `var(--color-on-surface)` 형태로 참조

### ❌ Don't

- 순수한 검정(`#000000`)을 텍스트에 쓰지 않는다 → `on_surface` (#2b3437) 사용
- 기본 box-shadow를 사용하지 않는다 → Tonal Layering 또는 Ambient Shadow 사용
- 영역 구분에 `1px solid border`를 사용하지 않는다 → 배경색 차이로 대체
- **색상값을 하드코딩하지 않는다** → `#2b3437`, `#0053dc` 등 직접 입력 금지, CSS 변수 사용
- 사이드바와 메인 영역 사이에 선을 긋지 않는다 → 색 전환으로 대체
- 기능적 명확성이 없는 아이콘을 사용하지 않는다 → 이 시스템은 타이포그래피 중심
- 리스트 항목 사이에 구분선을 사용하지 않는다 → 간격(`spacing.4`)으로 대체
