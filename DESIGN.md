# Clay에서 영감을 받은 디자인 시스템

## 1. 시각 테마와 분위기

Clay의 웹사이트는 B2B 데이터 인리치먼트를 딱딱한 엔터프라이즈 업무가 아니라 손맛이 느껴지는 작업처럼 다루는, 따뜻하고 장난기 있는 색채 중심의 디자인입니다. 다만 현재 AX-WMS 프로젝트 적용판에서는 페이지의 기본 캔버스를 순백(`#ffffff`)으로 두고, 따뜻한 크림 톤(`#faf9f7`)은 보조 표면과 구획용 muted surface로 제한합니다. 구조선은 여전히 오트 톤 보더(`#dad4c8`, `#eee9df`)를 사용해 Clay의 손맛을 유지하고, 그 위에 Matcha 그린, Slushie 시안, Lemon 골드, Ube 퍼플, Pomegranate 핑크, Blueberry 네이비, Dragonfruit 마젠타 같은 개성 강한 스와치 팔레트를 포인트로 얹습니다.

타이포그래피의 중심은 Roobert입니다. Roobert는 개성이 살아 있는 기하학적 산세리프이며, 다양한 OpenType 스타일 세트(`"ss01"`, `"ss03"`, `"ss10"`, `"ss11"`, `"ss12"`)를 사용해 독특하고 약간은 엉뚱한 성격을 만듭니다. 디스플레이 크기(80px, weight 600)에서는 공격적인 음수 자간(-3.2px)을 사용해 헤드라인을 압축감 있는 빌보드처럼 보이게 합니다. `Space Mono`는 코드와 기술성 있는 라벨을 위한 모노스페이스 파트너로 쓰이며, 이로써 craft와 tech가 만나는 이중적 성격이 완성됩니다.

Clay를 진짜로 구별 짓는 요소는 hover 마이크로 애니메이션입니다. 버튼은 hover 시 살짝 회전하고(`rotateZ(-8deg)`), 위로 이동하며(`translateY(-80%)`), 배경이 대비되는 스와치 색으로 바뀌고, 딱딱한 오프셋 그림자(`rgb(0,0,0) -7px 7px`)를 드리웁니다. 버튼이 실제로 기울고 튀어 오르는 듯한 이 playful hover는 B2B 소프트웨어에서는 보기 드문 물성의 즐거움을 만듭니다. 여기에 넉넉한 둥근 모서리(24px~40px 반경), 실선과 dashed border의 병행 사용, inset highlight를 포함한 다층 그림자 시스템이 더해지면서, Clay는 무언가를 만드는 행위 자체를 진심으로 즐기는 사람들이 만든 디자인 시스템처럼 느껴집니다.

**핵심 특징:**
- 화이트 캔버스(`#ffffff`)와 오트 톤 보더(`#dad4c8`) 조합. 메인 배경은 깔끔하되, 공예적인 디테일은 유지해야 함
- 이름이 붙은 스와치 팔레트: Matcha, Slushie, Lemon, Ube, Pomegranate, Blueberry, Dragonfruit
- 5개의 OpenType 스타일 세트를 사용하는 Roobert 폰트. 약간 괴짜 같은 기하학적 개성
- 회전 + 상승 + 하드 섀도우가 있는 장난기 있는 hover 애니메이션
- 코드와 기술 라벨에는 `Space Mono` 사용
- 넉넉한 border radius: 카드 24px, 섹션 40px, pill 1584px
- 하나의 인터페이스 안에서 solid border와 dashed border를 섞어 사용
- inset highlight가 들어간 다층 그림자: `0px 1px 1px` + `-1px inset` + `-0.5px`

## 2. 색상 팔레트와 역할

### 기본 색상
- **Clay Black** (`#000000`): 본문 텍스트, 헤딩, 가격 카드 텍스트, `--_theme--pricing-cards---text`
- **Pure White** (`#ffffff`): 페이지 배경, 카드 배경, 버튼 배경, 반전 텍스트
- **Warm Cream** (`#faf9f7`): 보조 표면, muted block, helper 영역에 쓰는 따뜻한 종이 톤

### 스와치 팔레트 - 이름이 있는 색상

**Matcha (Green)**
- **Matcha 300** (`#84e7a5`): `--_swatches---color--matcha-300`, 밝은 녹색 포인트
- **Matcha 600** (`#078a52`): `--_swatches---color--matcha-600`, 중간 녹색
- **Matcha 800** (`#02492a`): `--_swatches---color--matcha-800`, 어두운 섹션에 쓰는 깊은 녹색

**Slushie (Cyan)**
- **Slushie 500** (`#3bd3fd`): `--_swatches---color--slushie-500`, 밝은 시안 포인트
- **Slushie 800** (`#0089ad`): `--_swatches---color--slushie-800`, 깊은 틸

**Lemon (Gold)**
- **Lemon 400** (`#f8cc65`): `--_swatches---color--lemon-400`, 따뜻하고 옅은 골드
- **Lemon 500** (`#fbbd41`): `--_swatches---color--lemon-500`, 메인 골드
- **Lemon 700** (`#d08a11`): `--_swatches---color--lemon-700`, 깊은 앰버
- **Lemon 800** (`#9d6a09`): `--_swatches---color--lemon-800`, 더 어두운 앰버

**Ube (Purple)**
- **Ube 300** (`#c1b0ff`): `--_swatches---color--ube-300`, 부드러운 라벤더
- **Ube 800** (`#43089f`): `--_swatches---color--ube-800`, 깊은 보라
- **Ube 900** (`#32037d`): `--_swatches---color--ube-900`, 가장 어두운 보라

**Pomegranate (Pink/Red)**
- **Pomegranate 400** (`#fc7981`): `--_swatches---color--pomegranate-400`, 따뜻한 코랄 핑크

**Blueberry (Navy Blue)**
- **Blueberry 800** (`#01418d`): `--_swatches---color--blueberry-800`, 깊은 네이비

### 따뜻한 뉴트럴 스케일
- **Warm Silver** (`#9f9b93`): 보조/뮤트 텍스트, 푸터 링크
- **Warm Charcoal** (`#55534e`): 3차 텍스트, 어두운 뮤트 링크
- **Dark Charcoal** (`#333333`): 밝은 배경 위 링크 텍스트

### 표면과 보더
- **Oat Border** (`#dad4c8`): 메인 보더. 따뜻한 크림 계열 구조선
- **Oat Light** (`#eee9df`): 더 가벼운 2차 보더
- **Cool Border** (`#e6e8ec`): 대비용 섹션에 쓰는 차가운 톤 보더
- **Dark Border** (`#525a69`): 어두운 섹션 보더
- **Light Frost** (`#eff1f3`): 아주 은은한 버튼 배경(hover 시 0% opacity 상태 기준)

### 배지
- **Badge Blue Bg** (`#f0f8ff`): 푸른 톤 배지 표면
- **Badge Blue Text** (`#3859f9`): 선명한 파랑 배지 텍스트
- **Focus Ring** (`rgb(20, 110, 245) solid 2px`): 접근성 포커스 인디케이터

### 그림자
- **Clay Shadow** (`rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px`): inset highlight가 들어간 시그니처 다층 그림자
- **Hard Offset** (`rgb(0,0,0) -7px 7px`): hover 상태의 장난기 있는 하드 섀도우

## 3. 타이포그래피 규칙

### 폰트 패밀리
- **Primary**: `Roobert`, fallback: `Arial`
- **Monospace**: `Space Mono`
- **OpenType Features**: 모든 Roobert 텍스트에 `"ss01"`, `"ss03"`, `"ss10"`, `"ss11"`, `"ss12"` 적용. 디스플레이는 5개 전부 사용하고, body/UI는 `"ss03"`, `"ss10"`, `"ss11"`, `"ss12"` 사용

### 위계

| 역할 | 폰트 | 크기 | 두께 | 줄높이 | 자간 | 비고 |
|------|------|------|------|--------|------|------|
| Display Hero | Roobert | 80px (5.00rem) | 600 | 1.00 (tight) | -3.2px | 5개 스타일 세트 전부 사용 |
| Display Secondary | Roobert | 60px (3.75rem) | 600 | 1.00 (tight) | -2.4px | 5개 스타일 세트 전부 사용 |
| Section Heading | Roobert | 44px (2.75rem) | 600 | 1.10 (tight) | -0.88px to -1.32px | 5개 스타일 세트 전부 사용 |
| Card Heading | Roobert | 32px (2.00rem) | 600 | 1.10 (tight) | -0.64px | 5개 스타일 세트 전부 사용 |
| Feature Title | Roobert | 20px (1.25rem) | 600 | 1.40 | -0.4px | 5개 스타일 세트 전부 사용 |
| Sub-heading | Roobert | 20px (1.25rem) | 500 | 1.50 | -0.16px | 4개 스타일 세트 사용 (`ss01` 제외) |
| Body Large | Roobert | 20px (1.25rem) | 400 | 1.40 | normal | 4개 스타일 세트 사용 |
| Body | Roobert | 18px (1.13rem) | 400 | 1.60 (relaxed) | -0.36px | 4개 스타일 세트 사용 |
| Body Standard | Roobert | 16px (1.00rem) | 400 | 1.50 | normal | 4개 스타일 세트 사용 |
| Body Medium | Roobert | 16px (1.00rem) | 500 | 1.20-1.40 | -0.16px to -0.32px | 4~5개 스타일 세트 사용 |
| Button | Roobert | 16px (1.00rem) | 500 | 1.50 | -0.16px | 4개 스타일 세트 사용 |
| Button Large | Roobert | 24px (1.50rem) | 400 | 1.50 | normal | 4개 스타일 세트 사용 |
| Button Small | Roobert | 12.8px (0.80rem) | 500 | 1.50 | -0.128px | 4개 스타일 세트 사용 |
| Nav Link | Roobert | 15px (0.94rem) | 500 | 1.60 (relaxed) | normal | 4개 스타일 세트 사용 |
| Caption | Roobert | 14px (0.88rem) | 400 | 1.50-1.60 | -0.14px | 4개 스타일 세트 사용 |
| Small | Roobert | 12px (0.75rem) | 400 | 1.50 | normal | 4개 스타일 세트 사용 |
| Uppercase Label | Roobert | 12px (0.75rem) | 600 | 1.20 (tight) | 1.08px | `text-transform: uppercase`, 4개 스타일 세트 사용 |
| Badge | Roobert | 9.6px | 600 | - | - | pill 배지 |

### 원칙
- **5개의 스타일 세트가 정체성이다**: `"ss01"`, `"ss03"`, `"ss10"`, `"ss11"`, `"ss12"` 조합은 Roobert에 고유한 타이포그래피 성격을 부여한다. `ss01`은 헤딩과 강조용으로만 쓰고, 본문에서는 제외해 글리프 차이만으로도 미묘한 위계를 만든다.
- **공격적인 디스플레이 압축**: 80px에서 -3.2px, 60px에서 -2.4px처럼 강하게 압축된 디스플레이 자간과, 1.60 line-height의 넉넉한 본문 줄간격이 극적인 대비를 만든다.
- **헤딩 600, UI 500, 본문 400**: 세 가지 weight가 각각 엄격한 역할을 가진다.
- **양의 자간을 가진 대문자 라벨**: 12px uppercase에 1.08px 자간을 주어 길 찾기용 시스템 라벨 패턴을 만든다.

## 4. 컴포넌트 스타일링

### 버튼

**Primary (투명 배경 + hover 애니메이션)**
- 배경: transparent (`rgba(239, 241, 243, 0)`)
- 텍스트: `#000000`
- 패딩: 6.4px 12.8px
- 보더: 없음(또는 outlined 변형에서는 `1px solid #717989`)
- Hover: 배경이 대비되는 스와치 색(예: `#434346`)으로 바뀌고, 텍스트는 흰색이 되며, `rotateZ(-8deg)`, `translateY(-80%)`, 하드 섀도우 `rgb(0,0,0) -7px 7px` 적용
- Focus: `rgb(20, 110, 245) solid 2px` 아웃라인

**White Solid**
- 배경: `#ffffff`
- 텍스트: `#000000`
- 패딩: 6.4px
- Hover: oat-200 계열 스와치 색으로 바뀌며 회전 + 섀도우 애니메이션 적용
- 사용처: 컬러 섹션 위의 메인 CTA

**Ghost Outlined**
- 배경: transparent
- 텍스트: `#000000`
- 패딩: 8px
- 보더: `1px solid #717989`
- 반경: 4px
- Hover: dragonfruit 계열 스와치 색 + 흰 텍스트 + 회전 애니메이션

### 카드와 컨테이너
- 배경: 화이트 캔버스 위의 `#ffffff`
- 보더: `1px solid #dad4c8`(따뜻한 oat) 또는 `1px dashed #dad4c8`
- 반경: 12px(기본 카드), 24px(피처 카드/이미지), 40px(섹션 컨테이너/푸터)
- 그림자: `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px`
- Matcha, Slushie, Ube, Lemon 같은 스와치 팔레트를 사용한 컬러 섹션 배경

### 입력 요소와 폼
- 텍스트: `#000000`
- 보더: `1px solid #717989`
- 반경: 4px
- Focus: `rgb(20, 110, 245) solid 2px` 아웃라인

### 네비게이션
- 흰색 배경 위의 sticky top nav
- 네비게이션 링크는 Roobert 15px, weight 500
- Clay 로고는 좌측 정렬
- CTA 버튼은 우측 정렬 + pill 반경
- 하단 보더: `1px solid #dad4c8`
- 모바일: 767px에서 햄버거 메뉴로 접힘

### 이미지 처리
- 제품 스크린샷은 oat 보더가 있는 흰 카드 안에 배치
- 일러스트 섹션은 스와치 배경색을 적극적으로 사용
- 이미지 반경은 8px~24px
- 풀폭 컬러 섹션 배경 사용

### 특징적인 컴포넌트

**Swatch Color Sections**
- Matcha Green, Slushie Cyan, Ube Purple, Lemon Gold 등 스와치 색을 사용한 풀폭 섹션
- 어두운 스와치에는 흰 텍스트, 밝은 스와치에는 검은 텍스트
- 각 섹션은 자신만의 색으로 서로 다른 제품 이야기를 전달해야 함

**Playful Hover Buttons**
- Hover 시 `-8deg` 회전 + 위로 이동
- 부드러운 blur 그림자 대신 하드 오프셋 섀도우(`-7px 7px`) 사용
- 배경은 대비되는 스와치 색으로 전환
- 물리적이고 장난감 같은 인터랙션 감각을 만드는 것이 목적

**Dashed Border Elements**
- `1px dashed #dad4c8` 보더를 실선과 함께 사용
- 보조 컨테이너나 장식 요소에 활용
- 손으로 그린 듯한 craft 느낌을 더함

## 5. 레이아웃 원칙

### 간격 시스템
- 기본 단위: 8px
- 스케일: 1px, 2px, 4px, 6.4px, 8px, 12px, 12.8px, 16px, 18px, 20px, 24px

### 그리드와 컨테이너
- 최대 콘텐츠 너비를 가운데 정렬
- 흰 카드 섹션과 컬러 스와치 섹션이 번갈아 등장
- 카드 그리드는 데스크톱에서 2~3열
- 컬러 섹션은 풀폭으로 그리드를 끊어 줌
- 푸터 컨테이너는 넉넉한 40px 반경 사용

### 여백 철학
- **밝고 넉넉한 호흡**: 흰 배경은 콘텐츠 블록 사이의 구조를 더 또렷하게 만들고, 따뜻한 muted surface가 그 사이의 온도를 보완한다. 여백은 넉넉하지만 무표정하지 않아야 하며, 잘 차려진 테이블처럼 초대하는 감각이 있어야 한다.
- **색으로 만드는 리듬**: 번갈아 나오는 스와치 컬러 섹션은 단순한 whitespace가 아니라 색상 자체로 시각적 리듬을 만든다. 각각의 컬러 섹션은 하나의 독립된 "방"처럼 느껴져야 한다.
- **카드 안에서는 craft-like density**: 카드 내부는 내용이 촘촘하고 정리되어 있으며, 외부의 넉넉한 여백과 대비를 이룬다.

### Border Radius 스케일
- Sharp (4px): Ghost 버튼, 입력 요소
- Standard (8px): 작은 카드, 이미지, 링크
- Badge (11px): 태그 배지
- Card (12px): 기본 카드, 버튼
- Feature (24px): 피처 카드, 이미지, 패널
- Section (40px): 큰 섹션, 푸터, 컨테이너
- Pill (1584px): CTA, pill 형태 버튼

## 6. 깊이와 입체감

| 레벨 | 처리 방식 | 사용처 |
|------|-----------|--------|
| Flat (Level 0) | 그림자 없음, 화이트 캔버스 | 페이지 배경 |
| Clay Shadow (Level 1) | `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px inset, rgba(0,0,0,0.05) 0px -0.5px` | 카드와 버튼. inset highlight가 있는 다층 그림자 |
| Hover Hard (Level 2) | `rgb(0,0,0) -7px 7px` | hover 상태. playful한 하드 오프셋 섀도우 |
| Focus (Level 3) | `rgb(20, 110, 245) solid 2px` | 키보드 포커스 링 |

**그림자 철학**: Clay의 그림자 시스템은 아래로 드리우는 그림자(`0px 1px 1px`), 위쪽 inset highlight(`0px -1px 1px inset`), 아주 얕은 가장자리층(`0px -0.5px 1px`)으로 이루어진 독특한 3중 구조입니다. 이 구조는 요소가 단지 떠 있는 것이 아니라 점토 표면에 눌러 찍힌 것 같은 질감을 만듭니다. hover 시의 하드 섀도우(`-7px 7px`)는 인쇄물 시대의 그래픽 드롭 섀도우를 떠올리게 하며, 물성 있는 장난기를 더합니다.

### 장식적 깊이
- 풀폭 스와치 컬러 섹션은 색 대비만으로도 강한 입체감을 만든다
- dashed border는 실선과 함께 시각적 텍스처를 제공한다
- 제품 일러스트는 따뜻하고 유기적인 아트 스타일을 따라야 한다

## 7. Do's and Don'ts

### Do
- 페이지 배경은 순백(`#ffffff`)을 기본 캔버스로 사용한다. 따뜻함은 보조 표면과 보더에서 가져온다.
- Roobert 헤딩에는 반드시 5개의 OpenType 스타일 세트 `"ss01", "ss03", "ss10", "ss11", "ss12"`를 적용한다.
- 섹션 배경에는 Matcha, Slushie, Lemon, Ube, Pomegranate, Blueberry 같은 이름 있는 스와치 팔레트를 사용한다.
- `rotateZ(-8deg)`, `translateY(-80%)`, `-7px 7px` 하드 섀도우를 포함한 playful hover를 적용한다.
- 보더는 중립 회색이 아니라 따뜻한 oat 톤(`#dad4c8`)을 사용한다.
- solid border와 dashed border를 섞어서 시각적 변주를 만든다.
- 카드 24px, 섹션 40px처럼 넉넉한 반경을 사용한다.
- 헤딩은 600, UI는 500, 본문은 400만 사용한다.

### Don't
- 페이지 배경을 임의의 유색 톤으로 다시 물들이지 않는다. 현재 프로젝트 기준 기본 캔버스는 순백(`#ffffff`)이다.
- 중립 회색 보더(`#ccc`, `#ddd`)를 쓰지 않는다. 항상 따뜻한 oat 톤을 사용한다.
- 하나의 섹션 안에 2개를 넘는 스와치 색을 섞지 않는다.
- OpenType 스타일 세트를 생략하지 않는다. 이것이 Roobert를 Roobert답게 만든다.
- 은은한 hover만 쓰지 않는다. 회전 + 하드 섀도우가 시그니처다.
- 피처 카드에 작은 반경(<12px)을 쓰지 않는다. 넉넉한 둥글림은 구조적 요소다.
- 일반적인 blur 기반 그림자를 쓰지 않는다. Clay는 hard offset과 multi-layer inset을 사용한다.
- 1.08px 자간의 uppercase label을 빼먹지 않는다. 이것이 wayfinding 시스템이다.

## 8. 반응형 동작

### 브레이크포인트
| 이름 | 너비 | 주요 변화 |
|------|------|-----------|
| Mobile Small | <479px | 단일 컬럼, 촘촘한 패딩 |
| Mobile | 479-767px | 기본 모바일, 스택 레이아웃 |
| Tablet | 768-991px | 2열 그리드, 축약된 네비게이션 |
| Desktop | 992px+ | 전체 레이아웃, 3열 그리드, 확장된 섹션 |

### 터치 타깃
- 버튼: 충분한 터치 영역 확보를 위해 최소 6.4px + 12.8px 패딩 유지
- 네비게이션 링크: 15px 폰트와 넉넉한 간격 사용
- 모바일: 탭하기 쉽도록 버튼은 가능한 한 full-width 처리

### 접힘 전략
- Hero: 80px -> 60px -> 더 작은 디스플레이 텍스트로 축소
- 네비게이션: 가로 배치 -> 767px에서 햄버거 메뉴
- 피처 섹션: 다열 -> 단일 스택
- 컬러 섹션: 풀폭은 유지하되 패딩은 압축
- 카드 그리드: 3열 -> 2열 -> 1열

### 이미지 동작
- 제품 스크린샷은 비율을 유지한 채 축소
- 컬러 섹션 일러스트는 뷰포트 너비에 맞게 적응
- 라운드 코너는 모든 브레이크포인트에서 유지

## 9. 에이전트 프롬프트 가이드

### 빠른 색상 레퍼런스
- 배경: Pure White (`#ffffff`)
- 텍스트: Clay Black (`#000000`)
- 보조 텍스트: Warm Silver (`#9f9b93`)
- 보더: Oat Border (`#dad4c8`)
- 녹색 포인트: Matcha 600 (`#078a52`)
- 시안 포인트: Slushie 500 (`#3bd3fd`)
- 골드 포인트: Lemon 500 (`#fbbd41`)
- 보라 포인트: Ube 800 (`#43089f`)
- 핑크 포인트: Pomegranate 400 (`#fc7981`)

### 예시 컴포넌트 프롬프트
- "White (`#ffffff`) 배경 위에 hero를 만들어라. 헤드라인은 80px Roobert weight 600, line-height 1.00, letter-spacing -3.2px, OpenType 'ss01 ss03 ss10 ss11 ss12', 검은 텍스트. 서브타이틀은 20px weight 400, line-height 1.40, `#9f9b93` 텍스트. 버튼은 두 개: white solid pill(12px radius) 하나와 ghost outlined(4px radius, `1px solid #717989`) 하나."
- "Matcha 800 (`#02492a`) 배경의 컬러 섹션을 설계하라. 헤딩은 44px Roobert weight 600, letter-spacing -1.32px, 흰 텍스트. 본문은 18px weight 400, line-height 1.60, `#84e7a5` 텍스트. 내부에는 oat border(`#dad4c8`)와 24px radius를 가진 white card inset을 배치하라."
- "Playful hover가 있는 버튼을 만들어라. 기본 상태는 투명 배경, 검은 텍스트, 16px Roobert weight 500. Hover 시 배경은 `#434346`, 텍스트는 흰색, transform은 `rotateZ(-8deg) translateY(-80%)`, 그림자는 `rgb(0,0,0) -7px 7px`."
- "카드를 만들어라: 흰 배경, `1px solid #dad4c8` border, 24px radius. 그림자는 `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset`. 타이틀은 32px Roobert weight 600, letter-spacing -0.64px."
- "Uppercase label을 설계하라: 12px Roobert weight 600, `text-transform: uppercase`, letter-spacing 1.08px, OpenType 'ss03 ss10 ss11 ss12'."

### 반복 작업 가이드
1. 시작점은 항상 white(`#ffffff`) 캔버스다. warm cream(`#faf9f7`)은 보조 표면에서만 사용한다.
2. 스와치 색은 작은 포인트용이 아니라 큰 섹션용이다. Matcha, Slushie, Ube를 과감하게 사용한다.
3. 보더는 어디에나 oat(`#dad4c8`)를 사용하고, 장식에는 dashed 변형을 활용한다.
4. OpenType 스타일 세트는 필수다. 이것이 Roobert를 Clay답게 보이게 한다.
5. hover 애니메이션이 시그니처다. 미묘한 fade 대신 회전 + 하드 섀도우를 사용한다.
6. 반경은 넉넉해야 한다. 카드 24px, 섹션 40px. 날카롭거나 기업형처럼 보이면 안 된다.
7. weight는 세 가지뿐이다. 600(헤딩), 500(UI), 400(본문). 역할을 엄격히 지킨다.
