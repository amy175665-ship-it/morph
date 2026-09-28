import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} data-cursor="view" aria-labelledby={`product-${product.id}`}>
        <div className="product-card__image">
          <img src={product.image} alt={`${product.color} ${product.name}`} loading="lazy" />
          <span className="product-card__view" aria-hidden="true">VIEW OBJECT →</span>
        </div>
        <div className="product-card__info">
          <h2 id={`product-${product.id}`}>{product.name}</h2>
          <div className="product-card__details"><span>{product.color}</span><span>₩{product.price.toLocaleString('ko-KR')}</span></div>
        </div>
      </Link>
    </article>
  );
}
