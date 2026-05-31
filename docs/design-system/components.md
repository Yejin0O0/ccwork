# Components

## 버튼

### Primary Button

의도된 핵심 액션에만 사용. 한 화면에 하나.

```css
background: linear-gradient(to right, #0053dc, #3e76fe); /* tertiary → tertiary_container */
color: #faf8ff; /* on_tertiary */
border-radius: 0.375rem; /* md roundedness */
border: none;
```

### Secondary Button

보조 액션, 취소, 뒤로가기 등에 사용.

```css
background: #e2e9ec; /* surface_container_high */
color: #2b3437; /* on_surface */
border-radius: 0.375rem;
border: none;
```

### Tertiary (Ghost) Button

최소한의 존재감이 필요한 액션에 사용.

```css
background: transparent;
color: #0053dc; /* tertiary */
border: none;

/* hover */
background: rgba(0, 83, 220, 0.02); /* tertiary 2% opacity */
```

---

## 카드 & 리스트

### 카드

```css
background: #ffffff; /* surface_container_lowest */
border-radius: 0.5rem;
/* box-shadow 없음 → Tonal Layering으로 깊이 표현 */
```

### 호버 상태

```css
background: #f1f4f6; /* surface_container_low */
/* 트랜지션: background-color 150ms ease */
```

### 리스트 구분

```
항목 사이 구분선 금지.
gap: 1.4rem (spacing.4) 으로만 구분한다.
```

---

## 인풋 필드

### 기본 상태

```css
background: #ffffff; /* surface_container_lowest */
border: 1px solid rgba(171, 179, 183, 0.15); /* Ghost Border */
border-radius: 0.375rem;
```

### 포커스 상태

```css
border: 1px solid #0053dc; /* tertiary */
outline: none;
```

### 레이블

```css
font-size: 0.75rem; /* label-md */
text-transform: uppercase;
letter-spacing: 0.05em;
margin-bottom: 0.35rem; /* spacing.1 */
color: #586064; /* on_surface_variant */
/* 항상 인풋 위에 배치 — placeholder로 대체 금지 */
```

---

## Knowledge Token (태그 칩)

`#javascript`, `#design` 같은 토픽 태그에 사용하는 커스텀 칩.

```css
background: #dbe4e7; /* surface_container_highest */
color: #586064; /* on_surface_variant */
border-radius: 9999px; /* full roundedness */
border: none;
font-size: 0.75rem; /* label-md */
padding: 0.25rem 0.75rem;
```

### 호버 시 삭제 버튼

```css
/* 평상시: X 버튼 숨김 */
/* hover 시: X 버튼 표시 */
.token:hover .remove-btn {
  opacity: 1;
}
.remove-btn {
  opacity: 0;
  transition: opacity 150ms;
}
```

---

## Do / Don't

### ✅ Do

- Primary 버튼은 한 화면에 하나만 사용한다
- 인풋 레이블은 항상 인풋 위에 `label-md` 스타일로 배치한다
- Knowledge Token은 `full` roundedness를 유지한다
- 카드 hover는 배경색 전환으로만 표현한다

### ❌ Don't

- 리스트 항목 사이에 `<hr>` 또는 `border-bottom`을 사용하지 않는다
- 인풋에 placeholder만 있고 레이블이 없는 형태를 사용하지 않는다
- Knowledge Token에 border를 추가하지 않는다
- Ghost 버튼 hover에 배경색을 2% opacity 이상으로 진하게 하지 않는다
