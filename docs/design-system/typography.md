# Typography

## 서체

**Inter** 단일 서체 사용. 크기와 굵기 조합으로 계층을 만든다.

---

## 타입 스케일

| 역할     | 토큰          | 크기    | 굵기 | letter-spacing | line-height | 용도                       |
| -------- | ------------- | ------- | ---- | -------------- | ----------- | -------------------------- |
| Display  | `display-lg`  | 3.5rem  | 700  | -0.02em        | 1.2         | 랜딩 첫 화면, 임팩트 문구  |
| Headline | `headline-md` | 1.75rem | 600  | -0.01em        | 1.4         | TIL 노트 제목              |
| Body     | `body-lg`     | 1rem    | 400  | 0              | 1.6         | 본문, 노트 내용            |
| Label    | `label-md`    | 0.75rem | 500  | +0.05em        | 1.4         | 메타데이터, 날짜, 카테고리 |

---

## 색상 조합

| 상황                | 색상 토큰            | 값      |
| ------------------- | -------------------- | ------- |
| 장문 본문 읽기      | `on_surface_variant` | #586064 |
| 강조, 핵심 텍스트   | `on_surface`         | #2b3437 |
| Primary 버튼 텍스트 | `on_tertiary`        | #faf8ff |
| Ghost 버튼 텍스트   | `tertiary`           | #0053dc |

---

## 계층별 사용 규칙

### Display — The Statement

```
크기: 3.5rem
자간: -0.02em (타이트하게 조여 고급스러운 느낌)
용도: 랜딩 첫 화면처럼 단 한 번만 등장하는 임팩트 문구
```

### Headline — The Insight

```
크기: 1.75rem
행간: 1.4 (읽기를 유도하는 여유 있는 간격)
용도: 노트 제목, 섹션 타이틀
```

### Body — The Knowledge

```
크기: 1rem
색상: on_surface_variant (#586064) — 장문 읽기 시 눈의 피로 감소
강조 시: on_surface (#2b3437) 로 전환
```

### Label — The Metadata

```
크기: 0.75rem
대문자(uppercase) + 자간 +0.05em
용도: 날짜, 태그명, 카운트 등 기능적 메타데이터
```

---

## Do / Don't

### ✅ Do

- `label-md`는 항상 `uppercase`로 표기한다
- 노트 제목에는 `headline-md`와 `line-height: 1.4`를 사용한다
- 본문에는 `on_surface_variant`를 기본으로, 강조에만 `on_surface`를 사용한다

### ❌ Don't

- 하나의 화면에 `display-lg`를 두 번 이상 사용하지 않는다
- 본문에 `on_tertiary`(#faf8ff)를 사용하지 않는다 — 버튼 텍스트 전용
- `label-md`를 내러티브 콘텐츠에 사용하지 않는다 — 메타데이터 전용
