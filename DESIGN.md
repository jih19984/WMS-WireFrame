# AX-WMS Design System

## 1. Visual Thesis

AX-WMS의 현재 웹 UI는 "밝은 문서형 SaaS"가 아니라, 깊은 네이비 운영 셸 위에 작업 패널이 배치되는 workspace-first 인터페이스를 기준으로 한다. 전체 앱은 상단 바와 좌측 사이드바가 하나의 dark shell 환경을 이루고, 실제 작업면은 light/dark 테마에 따라 서로 다른 surface recipe로 반응한다.

이 프로젝트의 핵심 미감은 화려함보다 운영 밀도와 빠른 스캔성이다. 카드 수를 늘리는 대신, 위계와 정렬, 상태 배지, 보조 정보의 대비로 흐름을 읽히게 한다.

**핵심 원칙**
- 전체 앱은 deep navy shell을 유지한다.
- 콘텐츠 surface는 theme-aware 하게 바뀌지만, shell identity는 유지한다.
- 장식보다 정보 위계와 상태 가시성을 우선한다.
- 상태/중요도/AI/태그는 공통 badge language로 관리한다.
- hover와 transition은 존재감을 주되 업무 흐름을 방해하지 않는다.

## 2. Theme Model

### Shell Rule

- `body`는 light mode에서도 완전한 흰 배경이 아니라 deep navy gradient shell 위에 유지된다.
- `workspace-topbar`, `workspace-sidebar`는 항상 같은 셸 레시피를 공유한다.
- 사이드바 내 텍스트와 아이콘은 dark shell 가독성을 위해 흰색 계열을 우선 사용한다.

### Surface Rule

- light mode: white/glass 기반 패널, slate-blue border, 명확한 dark text
- dark mode: dark translucent panel, blue-tinted border, high-contrast light text

즉, **앱의 바깥 환경은 항상 어두운 셸**, **작업 표면만 테마에 따라 반응**하는 구조다.

## 3. Color System

### Light Tokens

| Token | Value | Usage |
|---|---|---|
| `background` | `#F4F6FC` | light theme semantic background |
| `foreground` | `#0F172A` | 기본 텍스트 |
| `card` | `rgba(255,255,255,0.85)` | 기본 패널 |
| `popover` | `rgba(255,255,255,0.95)` | 드롭다운, 도움말 |
| `primary` | `#1E3A8A` | 주요 액션 |
| `secondary` | `rgba(30,58,138,0.08)` | 보조 surface |
| `muted` | `rgba(30,58,138,0.06)` | inset, helper |
| `accent` | `rgba(30,58,138,0.12)` | hover, selection |
| `border` | `rgba(30,58,138,0.15)` | 기본 보더 |
| `input` | `rgba(255,255,255,0.86)` | 입력 surface |
| `ring` | `#3B82F6` | 포커스 링 |

### Dark Tokens

| Token | Value | Usage |
|---|---|---|
| `background` | `#020617` | dark theme semantic background |
| `foreground` | `#F8FAFC` | dark theme 기본 텍스트 |
| `card` | `rgba(15,23,42,0.88)` | dark panel |
| `popover` | `rgba(15,23,42,0.96)` | dark popover |
| `primary` | `#3B82F6` | dark theme primary |
| `secondary` | `rgba(30,58,138,0.18)` | 보조 surface |
| `muted` | `rgba(255,255,255,0.06)` | muted surface |
| `accent` | `rgba(59,130,246,0.18)` | hover, selection |
| `border` | `rgba(59,130,246,0.15)` | dark border |
| `input` | `rgba(255,255,255,0.06)` | dark input surface |
| `ring` | `#3B82F6` | 포커스 링 |

### Shell Tokens

| Token | Value | Usage |
|---|---|---|
| `workspace-shell-base` | `#0F1A35` | topbar/sidebar base |
| `workspace-shell-gradient` | radial + linear navy gradient | shell background |
| `sidebar-foreground` | `#F8FAFC` | shell text baseline |
| `sidebar-accent` | `rgba(255,255,255,0.1)` | active/hover shell item |

### Semantic Colors

| Semantic | Light Tone | Dark Tone | Meaning |
|---|---|---|---|
| Info / Active | blue | blue glow | 진행중, 기본 상태 |
| Success | emerald | emerald glow | 완료, 정상 |
| Warning | amber / orange | amber glow | 보류, 주의 |
| Error | red / rose | red glow | 실패, 긴급 |
| Cancelled | fuchsia | fuchsia glow | 취소 |
| Neutral | slate | slate tint | 대기, 보조 상태 |

## 4. Typography

### Font Families

- Primary Sans: `Pretendard Variable`, fallback `Pretendard`, system sans
- Mono: `IBM Plex Mono`, fallback `monospace`
- Feature settings: `"ss01" 1, "ss03" 1, "cv02" 1`

### Type Scale

| Role | Size | Weight | Tracking | Usage |
|---|---|---|---|---|
| Breadcrumb / Page Title | `1.05rem` to `28px` | `600` | `-0.04em` to `-0.05em` | 상단 경로, 화면 제목 |
| Section Title | `20px` to `22px` | `600` | `-0.04em` to `-0.05em` | 섹션/패널 타이틀 |
| Card Title | `18px` | `600` | `-0.03em` | 카드 제목 |
| Body | `15px` | `400` | default | 기본 본문 |
| UI Label | `14px` to `15px` | `500` to `600` | `-0.02em` | 버튼, 필드 라벨 |
| Meta | `11px` to `13px` | `400` to `500` | `0` to `0.01em` | 보조 정보, 날짜, 상태 텍스트 |
| Kicker | `11px` | `700` | `0.16em` to `0.22em` | eyebrow, scope label |

### Typography Rules

- 화면 제목은 짧고 방향성이 명확해야 한다.
- 본문 기본 크기는 `15px` 기준으로 유지한다.
- dark shell 위 텍스트는 흰색 계열을 우선 사용한다.
- light panel 내부 설명문은 `slate-600` 근처의 muted tone을 유지한다.

## 5. Surface Language

### Surface Recipes

| Surface | Recipe | Usage |
|---|---|---|
| Workspace Panel | border + translucent card fill + blur + soft shadow | 기본 카드, 리스트, 상세 패널 |
| Soft Panel | muted translucent fill + blur | 보조 정보, filter scope, helper box |
| Inset Panel | muted fill + stronger border + minimal shadow | 메타 정보, 파일/태그 입력 영역 |
| Popover | theme-aware white / dark panel | 도움말, 드롭다운, picker |
| Empty State | dashed border + muted fill | 빈 목록, placeholder |

### Shadows

| Level | Value | Usage |
|---|---|---|
| Panel | `0 8px 30px -12px rgba(15,23,42,0.45)` | 기본 카드 |
| Panel Strong | `0 30px 80px -38px rgba(15,6,19,0.48)` | 강조 surface |
| Dark Strong | `0 40px 110px -60px rgba(0,0,0,0.92)` | 어두운 셸 위 대형 surface |

### Material Rules

- 패널은 완전 불투명이 아니라 배경과 약하게 섞여야 한다.
- 테마가 바뀌어도 shell identity는 유지한다.
- 도움말 팝오버, 다이얼로그, 드롭다운은 반드시 theme-aware 해야 한다.

### Auth Surface

- 로그인/회원가입 화면은 일반 workspace panel이 아니라, full-screen dark auth stage를 사용한다.
- 배경은 `#060b16` 기반의 radial + linear navy gradient와 blur glow를 함께 사용한다.
- 로그인은 브랜드 타이포 중심, 회원가입은 wider glass form panel 중심으로 구성한다.
- auth card는 `max-width 480px` ~ `800px` 범위의 rounded glass panel을 사용한다.
- 상단 scope badge `ibank AX 사업본부`는 로그인/회원가입 모두 동일하게 유지한다.

## 6. Components

### Button

- Variants: `default`, `outline`, `secondary`, `ghost`, `destructive`
- 주요 높이: `40px`, `44px`, `48px` 계열
- Radius: `8px` to `16px`
- shell 위 버튼은 white border / black glass 조합을 허용한다.
- hover는 tint, contrast, subtle surface shift 중심으로 처리한다.

### Card

- Base radius: `16px` to `28px`
- CardSpotlight는 shell 위 대표 패널 언어다.
- hover는 살짝 lift 되더라도 과장된 이동은 피한다.

### Input / Textarea / Select

- 기본 높이: `40px`, 폼 내부 강조형은 `56px`
- Radius: `8px` to `16px`
- fill은 theme-aware input surface를 사용한다.
- registration surface에서는 입력/패널이 별도 recipe를 갖는다.
- 회원가입 폼에서는 `h-14`, `rounded-xl`, dark glass fill, stronger focus ring을 사용한다.
- 검증 실패 시 라벨은 rose tint로 바뀌고 경고 아이콘을 함께 노출한다.
- 검증 실패 필드는 rose border + dark rose surface + subtle ring으로 강조한다.
- 네이티브 `Select`의 option popup은 OS/browser 영향을 줄이기 위해 white background + dark text로 고정한다.

### Validation Feedback

- 회원가입 검증은 첫 오류에서 중단하지 않고 한 번에 수집해 하단에 모두 노출한다.
- 오류 메시지는 하나의 큰 alert panel보다, 개별 rounded cell로 분리해 스캔 가능하게 배치한다.
- 필드 주변 경고 표시와 하단 요약 오류 목록을 동시에 유지한다.
- 브라우저 기본 validation bubble은 쓰지 않고, 커스텀 validation UI를 우선한다.

### Badge

Badge는 현재 UI에서 가장 중요한 상태 전달 수단 중 하나이며, 반드시 theme-aware 해야 한다.

#### Common Variants

| Variant | Light | Dark | Usage |
|---|---|---|---|
| `default` | blue tint | blue glow tint | 기본 정보, 활성 |
| `secondary` | indigo / supporting tint | indigo glow tint | 보조 상태 |
| `outline` | slate neutral pill | slate translucent pill | 중립, 대기, generic tag |
| `success` | emerald tint | emerald glow tint | 완료, 운영중 |
| `warning` | amber tint | amber glow tint | 보류, 주의 |
| `destructive` | rose/red tint | rose/red glow tint | 실패, 긴급, 취소 |

#### Worklog Status Palette

| Status | Color Direction |
|---|---|
| `PENDING` | slate |
| `IN_PROGRESS` | blue |
| `DONE` | emerald |
| `ON_HOLD` | amber |
| `FAILED` | red |
| `CANCELLED` | fuchsia |

#### Importance Palette

| Importance | Color Direction |
|---|---|
| `URGENT` | rose |
| `HIGH` | indigo |
| `NORMAL` | sky |
| `LOW` | teal |

#### AI Status Palette

| AI Status | Color Direction |
|---|---|
| `PENDING` | slate |
| `PROCESSING` | sky/blue |
| `DONE` | emerald |
| `FAILED` | red |

#### Tag Palette

| Tag Kind | Color Direction |
|---|---|
| AI Source Tag | cyan |
| Manual Source Tag | violet |
| Tag Review | orange |
| Merge Candidate | violet family |
| Active Tag | emerald |

### Navigation

- 좌측 사이드바는 테마와 무관하게 dark shell 위 white text system을 유지한다.
- 비활성 메뉴는 `white/64` ~ `white/72`
- 활성 메뉴는 `white` + translucent white surface
- 아이콘 container도 white-tinted muted box를 사용한다.
- 하단 프로필 영역은 profile link + red logout icon button 조합을 사용한다.

### Help / Legend Popover

- light mode: white panel + slate text
- dark mode: `#020617` panel + slate-50 text
- 다크 모드에서 흰 패널이 뜨지 않도록 theme branch를 엄격히 유지한다.

## 7. Layout Principles

### Spacing

- Base unit: `8px`
- Common scale: `4`, `8`, `12`, `16`, `20`, `24`, `32`
- 대부분 패널 내부 기본 패딩은 `24px`

### Grid

- 상위 구조는 `Sidebar + Topbar + Workspace`
- 목록 화면은 필터 -> 상태/도움말 -> 리스트 흐름을 우선한다.
- 상세 화면은 primary workspace + secondary context 구조를 유지한다.

### Radius

| Token | Value | Usage |
|---|---|---|
| `sm` | `2px` | micro element |
| `md` | `6px` | inset / helper |
| `lg` | `8px` | 버튼, input |
| `xl` | `14px` | 강조 박스 |
| Card | `16px` to `28px` | 패널, spotlight card |
| Pill | `999px` | badge, chip, kicker |

## 8. Motion

- 기본 전환: `200ms ease-out`
- route content enter: `240ms cubic-bezier(0.22, 1, 0.36, 1)`
- hover는 lift보다 tint 변화와 shadow 조정 중심
- collapse/expand는 chevron rotation과 panel reveal로 처리

### Allowed Motion

- route fade/translate enter
- selected/active tint shift
- sidebar chevron rotate
- subtle spotlight reaction

### Avoid

- bounce
- exaggerated floating
- decorative parallax
- brand-first motion in task UI

## 9. Copy Style

- utility copy 우선
- 제목은 "무엇을 보는지" 즉시 드러나야 함
- 설명문은 범위, 상태, 행동을 짧게 전달
- 가이드/도움말 카피는 상태 의미를 빠르게 식별하게 해야 함

좋은 예시:
- `업무 탐색`
- `업무 상태 및 리스크`
- `업무 아이콘 안내`
- `현재 페이지 전체 선택`
- `회원가입`
- `프로필 사진 업로드`

## 10. Do / Don't

### Do

- deep navy shell identity를 유지한다.
- Pretendard Variable 중심 위계를 사용한다.
- badge를 상태 전달의 중심 언어로 사용한다.
- light/dark에 따라 badge, popover, panel이 실제로 달라지게 만든다.
- 사이드바는 white-on-navy 가독성을 유지한다.
- auth 화면은 브랜드/입력 흐름이 한눈에 읽히도록 단순한 field order를 유지한다.
- validation은 필드 위치와 하단 요약을 동시에 제공해 수정 경로를 짧게 만든다.

### Don't

- shell 위 텍스트를 global muted token에만 의존하지 않는다.
- dark mode에서 light popover가 뜨게 두지 않는다.
- 상태 태그를 페이지마다 서로 다른 색 체계로 다시 정의하지 않는다.
- AI 상태, 업무 상태, 태그 상태를 제각각의 unrelated color system으로 만들지 않는다.
- 네이티브 browser validation bubble에 핵심 검증 UX를 맡기지 않는다.
- 회원가입에서 URL 텍스트 입력만으로 프로필 이미지를 받지 않는다.

## 11. Source Of Truth

현재 스타일 기준은 아래 구현 파일을 우선으로 본다.

- `C:/git/pjt/s209-wireframe/apps/web/src/index.css`
- `C:/git/pjt/s209-wireframe/apps/web/src/components/ui/button.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/components/ui/input.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/components/ui/textarea.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/components/ui/select.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/components/ui/badge.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/components/ui/card.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/login/page.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/signup/page.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/_common/components/Sidebar.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/_common/components/GNB.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/_common/components/LegendHelpDialog.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/worklog/_components/worklog-badge-config.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/file/_components/file-ai-badge-config.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/tag/_components/TagStateBadge.tsx`
- `C:/git/pjt/s209-wireframe/apps/web/src/app/tag/_utils/tag-badge.ts`
