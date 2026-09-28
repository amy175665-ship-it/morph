# MORPH

![MORPH SHOP의 브랜드 비주얼](./src/assets/images/optimized/products/banner/shop_banner_img1.webp)

**Experimental Furniture & Object Gallery**

상품 데이터 기반의 목록·필터·상세 페이지·장바구니를 구현한 React 가구 편집숍 포트폴리오입니다.

**[LIVE DEMO](https://morph-pi-peach.vercel.app) · [GITHUB](https://github.com/amy175665-ship-it/morph)**

## 01 Project Overview

서울 기반의 가상 가구·오브제 브랜드를 콘셉트로 제작한 개인 프론트엔드 프로젝트입니다. **Data → State → Route → UI**의 연결을 중심으로, 공통 상품 데이터를 재사용하고 URL과 Context를 통해 사용자 선택을 화면에 반영했습니다.

이미지 중심의 레이아웃과 GSAP 인터랙션으로 브랜드를 표현하고, 반응형 구성과 키보드 접근성을 함께 구현했습니다.

## 02 Tech Stack

| 구분 | 기술 |
| --- | --- |
| Frontend | React 19 · JavaScript · React Router 7 |
| Styling | SCSS |
| Interaction | GSAP · ScrollTrigger |
| Build / Deployment | Vite 8 · Vercel |

## 03 Key Features

| 핵심 기능 | 구현 흐름 |
| --- | --- |
| **Data Rendering** | `products.js → filter / sort / map → ProductCard` |
| **Dynamic Routing** | `/product/:id → useParams → find()` |
| **URL State** | `useSearchParams`로 필터·정렬·보기 설정 유지 |
| **Cart State** | Context로 상품 추가·수량 변경·삭제·합계 공유 |
| **Interaction** | GSAP ImageTrail·슬라이드, ScrollTrigger 스크롤 효과 |
| **Optimization** | WebP 변환으로 사용 이미지 **약 41.6MB → 3.1MB** |

## 04 Data Rendering

[products.js](./src/data/products.js)의 상품 12개를 SHOP과 ProductDetail에서 공통으로 사용합니다. SHOP은 필터·정렬 결과를 `map()`으로 렌더링하고, [ProductCard](./src/components/product/ProductCard.jsx)에 props로 전달합니다. 정렬에는 복사본을 사용해 원본 데이터를 보존합니다.

상품 선택 시 `/product/:id`로 이동하고, [ProductDetail](./src/pages/ProductDetail/ProductDetail.jsx)에서 URL의 ID로 상품을 조회합니다.

```jsx
const { id } = useParams();
const product = products.find((item) => String(item.id) === id);
```

목록과 상세가 같은 데이터를 사용하므로 상품 정보의 기준이 일치합니다. 하나의 상세 컴포넌트를 재사용하며, 존재하지 않는 ID에는 안내와 SHOP 복귀 링크를 제공합니다.

## 05 Shop Filter & URL State

[SHOP](./src/pages/Shop/Shop.jsx)은 `useSearchParams`로 카테고리·색상·정렬·보기 설정을 읽고, `filter()`와 `sort()`로 표시할 상품을 계산합니다.

```text
/shop?category=chair&sort=price-low&view=2
```

탐색 조건을 URL에 두어 **상세 방문 후 뒤로 가기·새로고침·주소 공유에서도 선택값을 복원**합니다. 필터 패널의 열림 여부처럼 일시적인 UI 상태는 `useState`로 관리합니다.

잘못된 파라미터는 기본값으로 처리합니다. 빈 결과에서 필터를 초기화하면 카테고리·색상만 해제하고 정렬·보기 설정은 유지합니다.

## 06 Cart State Management

[CartProvider](./src/components/common/CartProvider.jsx)의 Context와 `useState`로 ProductDetail·CART·Header가 같은 장바구니를 공유합니다.

```text
ProductDetail → addToCart(product.id) → CartProvider
                                        ├─ Header: 총수량
                                        └─ CART: 상품 목록·수량·합계
```

| 동작 | 구현 |
| --- | --- |
| 상품 출력·수량 변경 | `map()`으로 새 배열 생성 |
| 상품 삭제 | `filter()`로 해당 상품 제외 |
| 총수량·상품 합계 | `reduce()`로 현재 상태에서 계산 |

페이지와 헤더가 같은 상태를 읽고 변경하므로 공통 Provider에 상태를 둡니다. **상품 ID와 수량만 저장**하고 상품 정보는 공통 데이터에서 연결하며, 합계는 별도 상태로 중복 저장하지 않습니다.

동일 상품을 다시 담으면 수량이 증가합니다. 최소 수량은 1개이며 삭제 버튼을 별도로 제공합니다. [CART](./src/pages/Cart/Cart.jsx)는 마지막 상품 삭제 후 빈 장바구니 안내를 표시합니다.

## 07 Interaction

| 화면 | 인터랙션 |
| --- | --- |
| HOME | 포인터 이동에 반응하는 [ImageTrail](./src/components/home/ImageTrail.jsx)·상태 기반 Hero 상품 전환 |
| COLLECTION | 사진 5장의 자동 순환·GSAP 크로스페이드·미세한 확대 |
| ABOUT | ScrollTrigger를 활용한 사진·소개 문장의 스크롤 진입 효과 |
| 공통 Cursor | 포인터 이동·클릭에 반응하는 형태 변화 |

`useRef`로 DOM을 참조하고 `useEffect`에서 모션을 등록합니다. 페이지 이탈 시 이벤트·타이머·애니메이션을 정리해 재진입 시 중복 실행을 방지합니다.

[COLLECTION](./src/pages/Collection/Collection.jsx)은 다음 이미지가 준비될 때까지 이전 사진을 유지하고, 로딩에 실패한 사진을 건너뜁니다. [ABOUT](./src/pages/About/About.jsx)은 `gsap.matchMedia()`로 화면 폭과 동작 줄이기 설정을 반영합니다.

## 08 Accessibility & Responsive

- **키보드 메뉴:** Escape 닫기·포커스 순환·닫은 뒤 포커스 복구
- **배경 제어:** 메뉴가 열린 동안 본문 `inert` 처리·스크롤 잠금과 복구
- **모션 설정:** `prefers-reduced-motion`에서 불필요한 이동·확대·자동 전환 축소 또는 중지
- **반응형 UI:** 화면 폭에 따른 상품 그리드·메뉴 구성, 터치 환경의 커서 효과 비활성화
- **탐색 흐름:** 필터 변경 시 포커스·스크롤 유지, 빈 결과·잘못된 주소의 복귀 경로 제공

## 09 Image Optimization

사용 이미지 27장을 WebP로 변환하고 제품의 투명 배경을 유지했습니다. 원본을 보존하면서 화면에는 최적화본을 사용하고, 터치 환경에서는 커서 이미지를 요청하지 않습니다.

| 항목 | 최적화 전 | 최적화 후 |
| --- | --- | --- |
| 사용 이미지 파일 합계 | 약 41.6MB | **약 3.1MB** |
| HOME 이미지 요청량 — Desktop | 약 23.15MB | **약 1.87MB** |
| HOME 이미지 요청량 — Mobile | 약 14.99MB | **약 1.04MB** |

로컬 프로덕션 미리보기의 Chromium에서 Desktop 1440×900·Mobile 터치 390×900으로 측정한 이미지 응답 크기입니다. 캐시·로딩 시점에 따라 달라질 수 있으며, 로딩 속도 점수를 의미하지 않습니다.

## 10 Project Structure

```text
src/
├─ assets/images/optimized/  # 화면에서 사용하는 WebP 이미지
├─ components/
│  ├─ common/               # Header, Footer, CartProvider, Cursor, RouteEffects
│  ├─ home/                 # ImageTrail
│  └─ product/              # ProductCard
├─ data/                    # products.js, journals.js
├─ pages/                   # Home, Shop, ProductDetail, Cart, Collection,
│                           # About, Journal, JournalDetail, NotFound
├─ styles/                  # 공통 SCSS·변수·리셋
├─ App.jsx                  # Provider·라우트 구성
└─ main.jsx                 # 앱 진입점
```

## 11 Build & Run

Node.js 22.12 이상인 22.x 또는 호환되는 최신 LTS 환경에서 실행합니다.

```sh
npm ci
npm run dev
```

프로덕션 빌드와 로컬 미리보기:

```sh
npm run build
npm run preview
```

## 12 Project Scope

가상 브랜드의 프론트엔드 포트폴리오로, 상품 탐색부터 장바구니 조작까지 구현했습니다. 장바구니는 메모리에서 관리해 새로고침 시 초기화되며 실제 주문·결제·서버 연동은 포함하지 않습니다. NEWEST 정렬은 상품 ID 내림차순을 기준으로 합니다.

세부 개발 기준은 [AGENTS.md](./AGENTS.md)에서 확인할 수 있습니다.
