# Elevation & Depth

## 핵심 원칙

그림자(box-shadow)로 깊이를 표현하지 않는다.
깊이는 **배경색 겹침(Tonal Layering)** 으로 표현한다.

---

## Tonal Layering (표준 카드)

`surface_container_lowest` 카드를 `surface_container` 위에 올리면
물리적인 종이 겹침처럼 "lifted" 효과가 생긴다.

```
┌─────────────────────────────┐  surface_container_lowest (#ffffff)
│  카드 / 활성 작업 영역      │  ← 가장 위에 뜬 레이어
└─────────────────────────────┘
  surface_container (#eaeff1)     ← 카드 아래 섹션 배경
```

> 일반 카드와 리스트에는 box-shadow를 사용하지 않는다.

---

## Ambient Shadow (플로팅 요소)

모달, 팝오버, "새 노트" 버튼처럼 실제로 떠 있어야 하는 요소에만 사용한다.

```css
box-shadow: 0 8px 32px rgba(43, 52, 55, 0.06),
            0 2px 8px  rgba(0, 83, 220, 0.04);
/*          ↑ on_surface 6%       ↑ tertiary 힌트로 팔레트 통일 */
blur: 24px ~ 40px
opacity: on_surface (#2b3437) 6%
accent tint: tertiary (#0053dc) 소량 추가
```

---

## Ghost Border (접근성 예외)

유사한 배경색 위에서 컨테이너를 구분해야 할 때 사용하는 최후의 수단.
선이 아닌 "선의 암시"여야 한다.

```css
border: 1px solid rgba(171, 179, 183, 0.15);
/* outline_variant (#abb3b7) at 15% opacity */
```

---

## Glassmorphism (플로팅 오버레이)

모달, 드롭다운, 호버 브레드크럼 등 화면 위에 떠 있는 UI에 적용한다.

```css
background: rgba(248, 249, 250, 0.8); /* surface 80% */
backdrop-filter: blur(12px);
```

---

## 사용 기준 요약

| 상황                    | 사용할 방법                    |
| ----------------------- | ------------------------------ |
| 일반 카드, 리스트       | Tonal Layering                 |
| 모달, 팝오버            | Ambient Shadow + Glassmorphism |
| 유사 배경에서 경계 필요 | Ghost Border                   |
| 사이드바/메인 영역 구분 | 색 전환 (No-Line Rule)         |

---

## Do / Don't

### ✅ Do

- 카드 깊이는 `surface_container_lowest`를 `surface_container` 위에 올려 표현한다
- 플로팅 요소의 그림자에 `tertiary` 색상 힌트를 소량 추가해 팔레트를 통일한다
- Ghost Border는 접근성이 필요한 경우에만 최후 수단으로 사용한다

### ❌ Don't

- 일반 카드에 `box-shadow`를 사용하지 않는다
- Ambient Shadow의 blur를 40px 이상으로 키우지 않는다 — 무거워 보임
- Ghost Border를 디자인 요소로 사용하지 않는다 — 접근성 예외 전용
