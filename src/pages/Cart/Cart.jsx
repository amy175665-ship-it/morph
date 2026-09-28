import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { CartContext } from '../../components/common/CartProvider';
import './Cart.scss';

export default function Cart() {
  const { items, totalQuantity, totalPrice, changeQuantity, removeFromCart } = useContext(CartContext);
  const [message, setMessage] = useState('');
  const headingRef = useRef(null);

  function handleRemove(product) {
    removeFromCart(product.id);
    setMessage(`${product.name} removed from your cart.`);
    // 삭제한 버튼이 사라져도 키보드 포커스가 페이지 밖으로 유실되지 않게 합니다.
    headingRef.current.focus();
  }

  return (
    <div className="cart-page">
      <Header />
      <main className="cart">
        <div className="cart__heading">
          <h1 ref={headingRef} tabIndex={-1}>YOUR CART <span>({totalQuantity})</span></h1>
          <Link to="/shop">CONTINUE EXPLORING ↗</Link>
        </div>
        <p className="cart__status" role="status">{message}</p>
        {items.length === 0 ? (
          <section className="cart__empty">
            <h2>A little space for something unexpected.</h2>
            <p>Your cart is currently empty.</p>
            <Link className="cart__action" to="/shop">EXPLORE OBJECTS ↗</Link>
          </section>
        ) : (
          <div className="cart__layout">
            <ul className="cart__items">
              {items.map(({ product, quantity }) => (
                <li className="cart__item" key={product.id}>
                  <Link className="cart__image" to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                    <img src={product.image} alt={`${product.name} in ${product.color}`} />
                  </Link>
                  <div className="cart__info">
                    <p className="cart__category">{product.category}</p>
                    <h2><Link to={`/product/${product.id}`}>{product.name}</Link></h2>
                    <p>{product.color}</p>
                    <p>₩{product.price.toLocaleString('ko-KR')} / EACH</p>
                    <div className="cart__quantity" role="group" aria-label={`${product.name} quantity`}>
                      <button type="button" disabled={quantity === 1} onClick={() => changeQuantity(product.id, -1)} aria-label={`Decrease ${product.name} quantity`}>−</button>
                      <span aria-live="polite" aria-atomic="true" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                      <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Increase ${product.name} quantity`}>＋</button>
                    </div>
                  </div>
                  <div className="cart__item-total">
                    <p>₩{(product.price * quantity).toLocaleString('ko-KR')}</p>
                    <button type="button" onClick={() => handleRemove(product)} aria-label={`Remove ${product.name}`}>REMOVE ×</button>
                  </div>
                </li>
              ))}
            </ul>
            <section className="cart__summary" aria-labelledby="cart-summary-title">
              <h2 id="cart-summary-title">SUMMARY</h2>
              <div><span>ITEMS</span><span>{totalQuantity}</span></div>
              <div className="cart__total" aria-live="polite" aria-atomic="true"><span>SUBTOTAL</span><span>₩{totalPrice.toLocaleString('ko-KR')}</span></div>
              <p>Product subtotal only. Contact MORPH for availability and delivery information.</p>
              <Link className="cart__action" to="/about">CONTACT MORPH ↗</Link>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
