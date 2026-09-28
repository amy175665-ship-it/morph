import { useState } from 'react';
import './Shop.scss';
import { useSearchParams } from 'react-router-dom';
import products from '../../data/products';
import ProductCard from '../../components/product/ProductCard';
import Header from '../../components/common/Header';
import shopBanner from '../../assets/images/optimized/products/banner/shop_banner_img1.webp';

const categories = ['all', 'chair', 'light', 'table', 'object'];
const colors = [...new Set(products.map((product) => product.color))];

export default function Shop() {
  // URL에 선택값을 보관해 상세에서 돌아오거나 새로고침해도 목록을 복원합니다.
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const color = searchParams.get('color');
  const sort = searchParams.get('sort');
  const selectedCategory = categories.includes(category) ? category : 'all';
  const selectedColor = colors.includes(color) ? color : 'all';
  const sortOrder = ['newest', 'price-low', 'price-high'].includes(sort) ? sort : 'newest';
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridColumns = searchParams.get('view') === '2' ? 2 : 4;

  function updateSelection(key, value, defaultValue) {
    const nextParams = new URLSearchParams(searchParams);
    if (value === defaultValue) nextParams.delete(key);
    else nextParams.set(key, String(value));
    // 필터 클릭마다 뒤로 가기 기록을 늘리지 않습니다.
    setSearchParams(nextParams, { replace: true });
  }

  function setSelectedCategory(value) { updateSelection('category', value, 'all'); }
  function setSelectedColor(value) { updateSelection('color', value, 'all'); }
  function setSortOrder(value) { updateSelection('sort', value, 'newest'); }
  function setGridColumns(value) { updateSelection('view', value, 4); }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesColor = selectedColor === 'all' || product.color === selectedColor;
    return matchesCategory && matchesColor;
  });

  // sort()는 배열을 바꾸므로 복사본을 정렬해 공통 상품 데이터를 보호합니다.
  const sortedProducts = [...filteredProducts].sort((first, second) => {
    if (sortOrder === 'price-low') return first.price - second.price;
    if (sortOrder === 'price-high') return second.price - first.price;
    // 등록일 데이터가 없으므로 현재는 큰 ID를 최신 등록 순서로 사용합니다.
    return second.id - first.id;
  });

  function resetFilters() {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('category');
    nextParams.delete('color');
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <div className="shop-page">
      <Header />
      <main className="shop">
        <img
          className="shop__banner"
          src={shopBanner}
          alt="파란 공간에 배치된 MORPH 오브제와 빨간 의자 옆에 앉아 있는 모델"
          fetchPriority="high"
        />
        <h1 className="shop__heading">SHOP / <span role="status">{sortedProducts.length} OBJECTS</span></h1>
        <div className="shop__categories" role="group" aria-label="Product category">
          {categories.map((category) => (
            <button type="button" key={category} aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category.toUpperCase()}</button>
          ))}
        </div>
        <div className="shop__toolbar">
          <div className="shop__views" role="group" aria-label="Product grid layout">
            <span>VIEW</span>
            <button type="button" aria-label="Compact product grid" aria-pressed={gridColumns === 4} onClick={() => setGridColumns(4)}>04</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-label="Large product grid" aria-pressed={gridColumns === 2} onClick={() => setGridColumns(2)}>02</button>
          </div>
          <div className="shop__utilities">
            <label className="shop__sort">SORT
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="newest">NEWEST</option>
                <option value="price-low">PRICE LOW TO HIGH</option>
                <option value="price-high">PRICE HIGH TO LOW</option>
              </select>
              <span aria-hidden="true">▾</span>
            </label>
            <button type="button" aria-expanded={filtersOpen} aria-controls="shop-filters" onClick={() => setFiltersOpen(!filtersOpen)}>FILTER {filtersOpen ? '×' : '+'}</button>
          </div>
        </div>

        <div id="shop-filters" className={`shop__filters-wrap${filtersOpen ? ' shop__filters-wrap--open' : ''}`} inert={!filtersOpen}>
          <div className="shop__filters">
            <fieldset>
              <legend>CATEGORY</legend>
              {categories.map((category) => {
                const count = category === 'all' ? products.length : products.filter((product) => product.category === category).length;
                return (
                  <label key={category}>
                    <input type="radio" name="category" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} />
                    <span>{category.toUpperCase()}</span><span className="shop__category-count">{String(count).padStart(2, '0')}</span>
                  </label>
                );
              })}
            </fieldset>
            <fieldset>
              <legend>COLOR</legend>
              {['all', ...colors].map((color) => (
                <label key={color}><input type="radio" name="color" checked={selectedColor === color} onChange={() => setSelectedColor(color)} /><span>{color.toUpperCase()}</span></label>
              ))}
            </fieldset>
            <fieldset>
              <legend>SORT</legend>
              {[
                { value: 'newest', label: 'NEWEST' },
                { value: 'price-low', label: 'PRICE LOW TO HIGH' },
                { value: 'price-high', label: 'PRICE HIGH TO LOW' },
              ].map((option) => (
                <label key={option.value}><input type="radio" name="sort" checked={sortOrder === option.value} onChange={() => setSortOrder(option.value)} /><span>{option.label}</span></label>
              ))}
            </fieldset>
            <button className="shop__clear" type="button" onClick={resetFilters}>CLEAR FILTERS</button>
          </div>
        </div>

        <div className={`shop__products${gridColumns === 2 ? ' shop__products--large' : ''}`}>
          {sortedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        {sortedProducts.length === 0 && (
          <div className="shop__empty"><p>No objects match these filters.</p><button type="button" onClick={resetFilters}>VIEW ALL OBJECTS</button></div>
        )}
      </main>
    </div>
  );
}
