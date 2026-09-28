import { useContext, useRef } from 'react';
import { CartContext } from '../../components/common/CartProvider';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import ProductCard from '../../components/product/ProductCard';
import products from '../../data/products';
import './ProductDetail.scss';

export default function ProductDetail() {
  const { items, addToCart } = useContext(CartContext);
  const { id } = useParams();
  // URL과 데이터의 ID를 비교해 해당 상품 하나를 찾습니다.
  const product = products.find((item) => String(item.id) === id);
  const dialogRef = useRef(null);
  const cartQuantity = items.find((item) => item.product.id === product?.id)?.quantity ?? 0;

  const relatedProducts = products.filter((item) => item.category === product?.category && item.id !== product?.id);

  return (
    <div className="product-detail-page">
      <Header />
      {!product ? (
        <main className="product-detail__missing">
          <p>OBJECT NOT FOUND</p>
          <h1>This object is not in our collection.</h1>
          <Link to="/shop">BACK TO SHOP ↗</Link>
        </main>
      ) : (
        <main className="product-detail" key={product.id}>
          <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
            <Link to="/shop">SHOP</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
          </nav>
          <div className="product-detail__layout">
            <div className="product-detail__visual">
              <span className="product-detail__image-label">MORPH OBJECT — {String(product.id).padStart(2, '0')}</span>
              <button className="product-detail__image-button" type="button" onClick={() => dialogRef.current.showModal()} aria-label={`Enlarge image of ${product.name}`} aria-haspopup="dialog">
                <img src={product.image} alt={`${product.name} in ${product.color}`} fetchPriority="high" />
                <span className="product-detail__zoom-label">VIEW CLOSER <span aria-hidden="true">＋</span></span>
              </button>
            </div>
            <section className="product-detail__info" aria-labelledby="product-name">
              <p className="product-detail__eyebrow">{product.category} / MORPH COLLECTION</p>
              <h1 id="product-name">{product.name}</h1>
              <p className="product-detail__price">₩{product.price.toLocaleString('ko-KR')}</p>
              <p className="product-detail__description">{product.description}</p>
              <div className="product-detail__color"><span>COLOR</span><span>{product.color}</span></div>
              <button className="product-detail__enquire" type="button" onClick={() => addToCart(product.id)}>ADD TO CART <span aria-hidden="true">＋</span></button>
              <div className="product-detail__cart-feedback">
                <p role="status">{cartQuantity > 0 ? `${cartQuantity} IN YOUR CART` : ''}</p>
                <Link to="/cart">VIEW CART ↗</Link>
              </div>
              <Link className="product-detail__contact" to="/about">CONTACT MORPH ↗</Link>
              <p className="product-detail__note">For availability and further product information, get in touch.</p>
              <div className="product-detail__accordions">
                <details open>
                  <summary>OBJECT DETAILS</summary>
                  <dl>
                    <div><dt>Reference</dt><dd>MORPH — {String(product.id).padStart(2, '0')}</dd></div>
                    <div><dt>Category</dt><dd className="product-detail__category">{product.category}</dd></div>
                    <div><dt>Color</dt><dd>{product.color}</dd></div>
                  </dl>
                </details>
                <details>
                  <summary>BEFORE YOU ORDER</summary>
                  <p>Please contact MORPH to confirm dimensions, materials, care instructions and delivery options for this object.</p>
                </details>
              </div>
            </section>
          </div>
          <section className="product-detail__related" aria-labelledby="related-title">
            <div className="product-detail__related-heading"><h2 id="related-title">IN GOOD COMPANY</h2><Link to="/shop">ALL OBJECTS ↗</Link></div>
            <div className="product-detail__related-grid">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
          </section>
          <dialog className="product-detail__dialog" ref={dialogRef} aria-label={`${product.name} enlarged image`} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
            <form method="dialog"><button type="submit" autoFocus aria-label="Close enlarged image">CLOSE ×</button></form>
            <img src={product.image} alt={`${product.name} in ${product.color}, enlarged view`} />
          </dialog>
        </main>
      )}
    </div>
  );
}
