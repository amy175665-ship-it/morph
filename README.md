# MORPH — React UI Project

**Experimental Furniture & Object Gallery**

서울 기반의 가상 가구·오브제 편집숍을 콘셉트로 제작한 React 개인 프로젝트입니다.
상품 탐색 → 필터링 → 상세 조회 → 장바구니로 이어지는 흐름을 구현하고, 이미지 중심의 레이아웃과 GSAP 인터랙션으로 브랜드의 시각적 경험을 표현했습니다.

**[Live Demo](https://morph-pi-peach.vercel.app) · [GitHub Repository](https://github.com/amy175665-ship-it/morph)**

## Project Overview

MORPH의 목표는 **데이터 → 상태·URL → UI 변화**가 어떻게 연결되는지 실제 화면과 코드로 설명하는 것입니다. 상품 데이터를 재사용하고, 탐색 조건을 URL로 관리하며, 여러 페이지에서 장바구니 상태를 공유하도록 구성했습니다.

| 항목 | 내용 |
| --- | --- |
| 유형 | 개인 프론트엔드 포트폴리오 |
| Frontend | React 19 · JavaScript · React Router 7 |
| Styling | SCSS · 반응형 레이아웃 |
| Interaction | GSAP · ScrollTrigger |
| Build / Deployment | Vite 8 · Vercel |

별도의 상태 관리·슬라이더 라이브러리나 UI 프레임워크 없이 React의 상태와 Context를 중심으로 구현했습니다.

## Core Implementation

### 01. Data Rendering — 공통 데이터로 만드는 상품 UI

**SHOP의 상품 12개를 `map()`으로 렌더링하고 `ProductCard`에 props로 전달합니다.** 필터·정렬 결과에 따라 같은 카드 컴포넌트를 재사용합니다.

```text
products.js → filter → sort → map → ProductCard
           → find → ProductDetail
```

**Why?** 목록과 상세에 상품 정보를 각각 작성하지 않고 하나의 데이터를 공유해 이름·가격·이미지의 기준을 일치시켰습니다. `sort()`는 원본 배열을 변경하므로 복사본을 정렬합니다.

[상품 데이터](./src/data/products.js) · [ProductCard](./src/components/product/ProductCard.jsx) · [SHOP 코드](./src/pages/Shop/Shop.jsx)

### 02. Category Filtering — URL에 남는 탐색 조건

**`useSearchParams`로 카테고리·색상·정렬·보기 설정을 관리하고, `filter()`로 표시할 상품을 계산합니다.**

```text
/shop?category=chair&sort=price-low&view=2
```

**Why?** 처음에는 페이지 내부 상태로 관리해 상세 방문 후 돌아오면 선택값이 초기화됐습니다. 조건을 URL로 옮겨 뒤로 가기·새로고침·주소 공유에서도 같은 목록을 볼 수 있도록 개선했습니다.

**Edge Case:** 잘못된 파라미터는 기본값으로 처리합니다. 검색 결과가 없으면 초기화 버튼을 제공하며, 초기화 시 카테고리·색상만 지우고 정렬·보기 설정은 유지합니다. 조건 변경 중에는 스크롤과 포커스를 유지합니다.

[필터·URL 상태 코드](./src/pages/Shop/Shop.jsx)

### 03. Dynamic Routing — URL에서 상품 상세까지

**상품 카드를 선택하면 `/product/:id`로 이동합니다.** `useParams()`로 받은 ID를 `find()`의 조건으로 사용해 공통 데이터에서 상품을 조회합니다.

```jsx
const { id } = useParams();
const product = products.find((item) => String(item.id) === id);
```

**Why?** 상품마다 페이지를 따로 만들지 않고, 하나의 상세 컴포넌트에 URL로 선택한 상품을 표시합니다. URL 파라미터는 문자열이므로 숫자 상품 ID를 문자열로 변환해 비교합니다.

**Edge Case:** 존재하지 않는 ID에는 안내와 SHOP 복귀 링크를 제공합니다. 유효한 상세 화면에서는 이미지 확대·관련 상품·장바구니 담기를 지원합니다.

[상품 상세 코드](./src/pages/ProductDetail/ProductDetail.jsx)

### 04. Cart State — 여러 화면이 공유하는 장바구니

**`CartProvider`의 Context와 `useState`로 상세 페이지·CART·Header가 같은 상태를 사용합니다.**

```text
ProductDetail → addToCart(product.id) → CartProvider
                                        ├─ Header: 총수량
                                        └─ CART: 목록 · 수량 · 상품 합계
```

| 동작 | 구현 |
| --- | --- |
| 상품 출력·수량 변경 | `map()` |
| 상품 삭제 | `filter()` |
| 총수량·상품 합계 | `reduce()` |

**Why?** 서로 다른 페이지와 헤더가 같은 장바구니를 읽고 변경해야 하므로 공통 Provider에 상태를 둡니다. 상품 ID와 수량만 저장하고 상품 정보는 공통 데이터에서 연결합니다. 기존 배열을 직접 바꾸지 않고 새 배열로 갱신하며, 합계는 별도 상태에 중복 저장하지 않고 계산합니다.

**Edge Case:** 동일 상품을 다시 담으면 수량이 증가합니다. 최소 수량은 1개이고 삭제는 별도 버튼으로 처리합니다. 마지막 상품을 삭제하면 빈 장바구니 안내를 표시합니다.

[공유 상태 코드](./src/components/common/CartProvider.jsx) · [CART 화면 코드](./src/pages/Cart/Cart.jsx)

### 05. Interaction — 브랜드 경험과 모션의 생명주기

**`useRef`로 DOM을 참조하고 `useEffect`에서 GSAP 모션과 이벤트를 등록·정리합니다.**

- **HOME:** 포인터 이동에 반응하는 ImageTrail과 상태에 따른 Hero 상품 전환
- **COLLECTION:** 사진 5장의 자동 순환·크로스페이드·미세한 확대
- **ABOUT:** ScrollTrigger로 사진과 소개 문장의 스크롤 진입 효과
- **공통 Cursor:** 포인터 이동·클릭에 반응하는 형태 변화

**Why?** 화면을 이동한 뒤에도 이벤트·타이머·애니메이션이 남지 않도록 cleanup을 구성했습니다. 모바일과 동작 줄이기 설정에서는 효과를 줄이거나 정적으로 표시합니다.

**Edge Case:** COLLECTION은 다음 이미지가 준비될 때까지 이전 사진을 유지하고, 로딩 실패 사진은 건너뜁니다. 모두 실패하면 반복을 멈추고 안내합니다. 메뉴에는 Escape 닫기·포커스 순환·배경 `inert`·스크롤 복구를 적용했습니다.

[ImageTrail](./src/components/home/ImageTrail.jsx) · [COLLECTION](./src/pages/Collection/Collection.jsx) · [ABOUT](./src/pages/About/About.jsx)

## Image Optimization

사용 이미지 27장을 WebP로 최적화하고, 제품의 투명 배경을 유지했습니다. 원본은 보존하며 화면에는 `src/assets/images/optimized/`의 파일을 사용합니다. 터치 환경에서는 커서 이미지를 요청하지 않습니다.

| 항목 | 최적화 전 | 최적화 후 |
| --- | --- | --- |
| 사용 이미지 파일 합계 | 약 41.6MB | **약 3.1MB** |
| HOME 이미지 요청량 — Desktop | 약 23.15MB | **약 1.87MB** |
| HOME 이미지 요청량 — Mobile | 약 14.99MB | **약 1.04MB** |

로컬 프로덕션 미리보기의 Chromium에서 데스크톱 1440×900·모바일 터치 390×900 기준으로 측정했습니다. 이미지 응답 크기이며 실제 배포 속도 점수는 아닙니다. 캐시·로딩 시점·뷰포트에 따라 달라질 수 있습니다.

## Pages

| 페이지 | 역할 |
| --- | --- |
| HOME | 브랜드 랜딩·추천 상품·컬렉션·ABOUT·JOURNAL 미리보기 |
| SHOP / PRODUCT DETAIL / CART | 상품 탐색부터 상세 조회·장바구니 상태 변경까지 |
| COLLECTION | 자동 사진 슬라이드 |
| ABOUT | Founder 사진 4장·브랜드 소개·연락처 |
| JOURNAL / JOURNAL DETAIL | 콘텐츠 4개의 비대칭 목록·기사 상세·다음 기사 이동 |
| NOT FOUND | 잘못된 주소 안내·복귀 링크 |

## Build & Run

Node.js 22.12 이상인 22.x 또는 호환되는 최신 LTS 환경에서 실행합니다.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Scope & Verification

MORPH는 가상 브랜드의 프론트엔드 포트폴리오입니다. 로그인·서버 API·DB·실제 주문·결제는 포함하지 않습니다. 장바구니는 페이지 이동 중 유지되지만 새로고침하면 초기화됩니다. NEWEST 정렬은 상품 ID 내림차순을 사용합니다.

빌드와 Chromium의 반응형 화면·메뉴·라우팅·필터 복원·장바구니·이미지 실패 처리를 확인했습니다. 실제 모바일 기기·Safari 검증과 이미지 출처·사용 범위 정리는 남아 있습니다.

개발 기준과 세부 작업 지침은 [AGENTS.md](./AGENTS.md)에서 확인할 수 있습니다.
