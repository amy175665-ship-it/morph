import { createContext, useState } from 'react';
import products from '../../data/products';

export const CartContext = createContext(null);

export default function CartProvider({ children }) {
  // 페이지가 바뀌어도 Provider가 유지되므로 같은 장바구니를 공유합니다.
  const [cartItems, setCartItems] = useState([]);

  function addToCart(productId) {
    if (!products.some((product) => product.id === productId)) return;
    setCartItems((previousItems) => {
      const existingItem = previousItems.find((item) => item.productId === productId);
      if (existingItem) {
        return previousItems.map((item) => {
          if (item.productId === productId) return { ...item, quantity: item.quantity + 1 };
          return item;
        });
      }
      return [...previousItems, { productId, quantity: 1 }];
    });
  }

  function changeQuantity(productId, change) {
    setCartItems((previousItems) => previousItems.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    }));
  }

  function removeFromCart(productId) {
    setCartItems((previousItems) => previousItems.filter((item) => item.productId !== productId));
  }

  // 상품 정보는 복제해서 저장하지 않고 공통 데이터에서 연결합니다.
  const items = cartItems.map((item) => ({
    product: products.find((product) => product.id === item.productId),
    quantity: item.quantity,
  }));
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalQuantity, totalPrice, addToCart, changeQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
