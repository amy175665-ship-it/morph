# MORPH

**실행 화면: [MORPH Live](https://morph-pi-peach.vercel.app)**

서울 기반의 가상 가구·오브제 편집숍을 표현한 개인 React 포트폴리오입니다. 브랜드 중심의 화면 구성과 사용자 입력에 따라 바뀌는 UI를 함께 구현했습니다.

상품 탐색 → 상세 조회 → 장바구니 담기·수량 변경·삭제 흐름을 중심으로 React 상태 관리, 라우팅, 배열 메서드를 사용합니다. 실제 판매·결제 서비스가 아닙니다.

## 실행

Node.js 22.12 이상인 22.x 또는 호환되는 최신 LTS와 npm을 사용합니다. 설치 버전은 `package-lock.json`을 기준으로 합니다.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

개발·미리보기 주소는 터미널 실행 로그에서 확인합니다. PowerShell 실행 정책 오류가 나면 `npm.cmd ci`, `npm.cmd run dev`처럼 실행하며 시스템 실행 정책을 변경할 필요는 없습니다.

## 기술

React 19, JavaScript, React Router 7, Vite 8, SCSS, GSAP 및 ScrollTrigger를 사용합니다. 별도 상태 관리·슬라이더·UI 프레임워크는 사용하지 않습니다. 정확한 버전은 [package.json](./package.json)과 잠금 파일을 참고하세요.

## 페이지와 구현 개념

| 페이지 | 경로 | 주요 기능·개념 |
| --- | --- | --- |
| HOME | `/` | 상품 전환 `useState`, 추천 콘텐츠 `map`, ImageTrail의 `useRef`·`useEffect`·GSAP |
| SHOP | `/shop` | 카테고리·색상 필터, 가격 정렬, 보기 전환, `filter`·`sort`·`map`·`useSearchParams` |
| PRODUCT DETAIL | `/product/:id` | `useParams`·`find`, 이미지 확대, 관련 상품, 장바구니 담기 |
| CART | `/cart` | Context·`useState`, `map`으로 수량 변경·출력, `filter`로 삭제, `reduce`로 합계 |
| COLLECTION | `/collection` | 사진 5장, 자동 순환, GSAP 크로스페이드·확대, 이미지 실패 처리 |
| ABOUT | `/about` | Founder 사진 4장·소개, ScrollTrigger 등장 효과·정리 |
| JOURNAL | `/journal` | 에디토리얼 4개, 비대칭 목록과 데이터 렌더링 |
| JOURNAL DETAIL | `/journal/:slug` | 기사 조회·잘못된 slug 안내·다음 기사 순환 |
| NOT FOUND | 나머지 경로 | 404 안내와 HOME·SHOP 복귀 링크 |

### 상품 데이터와 장바구니

[products.js](./src/data/products.js)의 상품 12개를 SHOP과 상세 페이지가 공유합니다. SHOP은 필터·정렬 결과를 `ProductCard`에 props로 전달하고, 상세 페이지는 URL ID와 일치하는 상품을 조회합니다. 주소는 `/product/1` 형식이며 `01` 표기는 화면의 상품 번호에만 사용합니다.

[CartProvider.jsx](./src/components/common/CartProvider.jsx)는 상품 ID와 수량을 상태로 보관합니다. 중복 담기는 수량을 늘리고, 수량은 최소 1개를 유지하며, 삭제는 별도 버튼으로 처리합니다. 상품 정보는 공통 데이터에서 연결하고 총수량과 상품 합계는 매 렌더링 시 계산합니다. 상세·CART·헤더가 같은 상태를 공유합니다.

### 탐색 상태 유지

SHOP의 `category`, `color`, `sort`, `view`는 URL 검색 파라미터에 저장됩니다.

```text
/shop?category=chair&sort=price-low&view=2
```

상세 방문 후 뒤로 가기, 새로고침, 직접 URL 접근에서도 선택값을 복원합니다. 잘못된 값은 기본값으로 처리합니다. 필터 변경은 현재 기록을 교체하며 스크롤과 포커스를 유지합니다. 필터 초기화는 카테고리·색상만 지우고 정렬과 보기 설정은 유지합니다.

[RouteEffects.jsx](./src/components/common/RouteEffects.jsx)는 페이지 제목·이동 시 본문 포커스·스크롤 초기화·세션 내 뒤로 가기 위치 복원을 담당합니다.

### 모션과 접근성

- HOME의 ImageTrail은 정밀 포인터가 있는 701px 이상 화면에서 실행합니다. Hero 최초 등장이나 본문 ScrollTrigger 효과는 구현하지 않았습니다.
- 공통 커서는 포인터 이동·클릭에 반응합니다. 터치 환경과 동작 줄이기 설정에서는 커서 이미지를 요청하지 않습니다.
- COLLECTION은 이미지 디코딩 후 4.5초 타이머를 시작하며 1.1초 크로스페이드를 적용합니다. 실패한 이미지는 건너뛰고 이전 사진을 유지합니다. 모두 실패하면 안내를 표시하고 반복을 멈춥니다.
- ABOUT 사진은 스크롤 진입 시 한 번 등장합니다. 이동량은 데스크톱 28px, 600px 이하에서는 12px입니다. 중간 소개 문장은 짧게 페이드인합니다.
- 동작 줄이기 설정에서는 COLLECTION의 자동 전환·확대와 ABOUT 등장 모션을 중지합니다.
- 메뉴의 Escape 닫기·포커스 순환·배경 `inert`·스크롤 잠금 복구, 검색 빈 결과 안내를 지원합니다. 이벤트·타이머·GSAP 효과는 이탈 시 정리합니다.

## 이미지 최적화

화면에는 `src/assets/images/optimized/`의 WebP 27장을 사용합니다. 원본 파일은 기존 경로에 보관하며 덮어쓰지 않았습니다. 제품의 투명 배경을 유지하고 커서는 표시 크기에 맞춰 축소했습니다.

| 항목 | 최적화 전 | 최적화 후 |
| --- | --- | --- |
| 사용 이미지 파일 합계 | 약 41.6MB | 약 3.1MB |
| 홈 이미지 요청량: 데스크톱 | 약 23.15MB | 약 1.87MB |
| 홈 이미지 요청량: 모바일 | 약 14.99MB | 약 1.04MB |

홈 수치는 로컬 프로덕션 미리보기의 Chromium에서 데스크톱 1440×900, 모바일 터치 390×900으로 측정한 이미지 응답 크기입니다. 로딩 시점·캐시·뷰포트에 따라 달라지며 실제 배포 속도나 Lighthouse 점수를 뜻하지 않습니다.

## 구조

```text
src/
├─ assets/images/          # 원본과 optimized/ 이미지
├─ components/
│  ├─ common/              # Header, Footer, Cursor, CartProvider, RouteEffects
│  ├─ home/                # ImageTrail
│  └─ product/             # ProductCard
├─ data/                   # products.js, journals.js
├─ pages/                  # 페이지별 JSX·SCSS, NotFound 포함
├─ styles/                 # 변수, 리셋, 공통 스타일
├─ App.jsx
└─ main.jsx
```

## 범위와 남은 확인

- 장바구니는 메모리 상태입니다. 페이지 이동 시 유지되지만 새로고침하면 초기화됩니다.
- 로그인·서버 API·DB·주문·결제·배송비 계산은 구현 범위에 포함하지 않습니다. CART는 상품 합계만 표시합니다.
- NEWEST는 출시일이 아닌 상품 ID 내림차순입니다.
- 브랜드·상품 설명·기사·연락처는 포트폴리오용 가상 콘텐츠입니다. Instagram은 실제 계정 링크가 없습니다.
- 이미지 제작 방식·출처·공개 범위는 저장소 자료만으로 확정할 수 없어 공개 전에 작성자의 확인이 필요합니다.
- Vercel에 배포돼 있습니다. GitHub 저장소 연결은 아직 완료하지 않았습니다.
- BrowserRouter의 직접 접근·새로고침을 위해 vercel.json에서 index.html로 rewrite합니다. 다른 플랫폼이나 하위 경로로 옮길 때는 서버 라우팅·Vite base·라우터 경로를 다시 검토해야 합니다.

## 배포

Vercel 프로젝트 이름은 `morph`이며 위 실행 주소를 사용합니다. Vercel CLI 로그인과 해당 프로젝트 권한이 있는 환경에서 재배포합니다.

```sh
vercel deploy --prod
```

Windows PowerShell에서는 `vercel.cmd deploy --prod`를 사용할 수 있습니다. `.vercelignore`는 임시 브라우저 프로필·원본 이미지 등을 업로드에서 제외합니다. 실제 화면에서 사용하는 optimized/ 이미지는 포함합니다. `.vercel/`의 계정별 연결 정보는 Git에 올리지 않습니다.

## 검증

로컬에서 `npm run build`와 Chromium 브라우저 검증을 수행했습니다. 320·390·768·1440px 레이아웃, 메뉴 키보드·터치 조작, 빈 필터 결과, 상품·기사 링크, 장바구니, ABOUT 정리·동작 줄이기 설정, 이미지 로딩을 확인했습니다. 검증 스크립트는 임시 도구이며 저장소에 상시 실행하는 자동 테스트 체계는 아직 없습니다.

SHOP의 뒤로 가기·새로고침 시 선택 복원, 잘못된 검색 파라미터, 필터 초기화, 선택 중 포커스·스크롤 유지를 확인했습니다. COLLECTION은 네트워크 요청을 차단해 첫 사진·중간 사진·전체 실패와 동작 줄이기 환경을 재현하고, 다음 정상 사진으로의 전환 또는 오류 안내를 확인했습니다.

실제 모바일 기기·Safari 및 배포 서버 환경 확인은 남아 있습니다. 작업 시 지켜야 할 기준은 [AGENTS.md](./AGENTS.md)에 정리했습니다.
