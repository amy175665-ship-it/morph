import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Collection from "./pages/Collection/Collection";
import About from "./pages/About/About";
import Journal from "./pages/Journal/Journal";
import JournalDetail from "./pages/JournalDetail/JournalDetail";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Cursor from "./components/common/Cursor";
import CartProvider from "./components/common/CartProvider";
import RouteEffects from "./components/common/RouteEffects";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <CartProvider>
    <Cursor />
    <RouteEffects />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/about" element={<About />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/journal/:slug" element={<JournalDetail />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </CartProvider>
  );
}

export default App;
