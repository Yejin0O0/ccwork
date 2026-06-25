# Colors

## 색상 토큰

| 토큰                        | 값      | 용도                                    |
| --------------------------- | ------- | --------------------------------------- |
| `background`                | #f8f9fa | 기본 캔버스                             |
| `surface`                   | #f8f9fa | 주요 콘텐츠 영역                        |
| `surface_container_lowest`  | #ffffff | 카드, 활성 작업 영역 (가장 높은 레이어) |
| `surface_container_low`     | #f1f4f6 | 사이드바, 내비게이션 배경               |
| `surface_container`         | #eaeff1 | 섹션 구분 배경                          |
| `surface_container_high`    | #e2e9ec | Secondary 버튼 배경                     |
| `surface_container_highest` | #dbe4e7 | 선택된 항목, Knowledge Token 배경       |
| `outline_variant`           | #abb3b7 | Ghost Border 전용 (15% opacity)         |
| `on_surface`                | #2b3437 | 주요 텍스트, 강조 텍스트                |
| `on_surface_variant`        | #586064 | 본문 텍스트, 보조 텍스트                |
| `tertiary`                  | #0053dc | 액센트 컬러, CTA, 포커스 보더           |
| `tertiary_container`        | #3e76fe | CTA 그라디언트 끝 색상                  |
| `on_tertiary`               | #faf8ff | Primary 버튼 텍스트                     |

---

## Surface 계층 구조

깊이는 테두리가 아닌 배경색 겹침으로 표현한다.

```
surface_container_lowest (#ffffff)   ← 카드, 활성 영역 (최상위)
      ↑ "lifted paper" 효과
surface_container (#eaeff1)          ← 섹션 구분
      ↑
surface_container_low (#f1f4f6)      ← 사이드바, 내비게이션
      ↑
surface / background (#f8f9fa)       ← 기본 캔버스 (최하위)
```

---

## No-Line Rule

> 영역 구분에 `1px solid border`는 절대 사용하지 않는다.

경계는 **배경색 전환**으로만 표현한다.

```
사이드바 (surface_container_low #f1f4f6)
메인 영역 (background #f8f9fa)
→ 선 없이 색 차이만으로 구분
```

---

## Glass & Gradient Rule

### Glassmorphism (플로팅 요소)

모달, 드롭다운, 호버 요소에 적용한다.

```css
background: rgba(248, 249, 250, 0.8); /* surface 80% opacity */
backdrop-filter: blur(12px);
```

### CTA 그라디언트

Primary 액션 버튼에만 적용한다. 단색보다 입체감 있는 "jewel-like" 느낌을 준다.

```css
background: linear-gradient(to right, #0053dc, #3e76fe);
/* tertiary → tertiary_container */
```

---

## Do / Don't

### ✅ Do

- Surface 토큰을 계층 순서대로 사용한다 (`lowest` → `low` → `container` 순으로 위로 올라옴)
- 액센트 컬러(`tertiary`)는 포커스, CTA, Ghost 버튼 텍스트에만 사용한다
- **색상은 반드시 CSS 변수로만 참조한다** → `var(--color-on-surface)`, `var(--color-tertiary)` 형태 사용

### ❌ Don't

- `#000000` 순수 검정을 텍스트에 쓰지 않는다 → `on_surface` (#2b3437) 사용
- 사이드바 경계에 선을 긋지 않는다 → 색 전환으로 대체
- `tertiary`를 장식 목적으로 남용하지 않는다
- **색상값을 코드에 직접 입력하지 않는다** → `#2b3437`, `rgb(43,52,55)` 등 하드코딩 금지
