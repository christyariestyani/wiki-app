import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Banner from './components/Banner';
import CategoryBar from './components/CategoryBar';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';

export default function App() {
  const [category, setCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const shopRef = useRef(null);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="app">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onCategoryChange={(cat) => {
          setCategory(cat);
          scrollToShop();
        }}
        activeCategory={category}
      />

      <Hero onShopNow={scrollToShop} />

      <Banner onShop={(cat) => { setCategory(cat); scrollToShop(); }} />

      <section className="shop-section" ref={shopRef}>
        <div className="section-header">
          <h2>The Collection</h2>
          <p>Thoughtfully curated pieces for the modern woman.</p>
        </div>
        <CategoryBar active={category} onChange={setCategory} />
        <ProductGrid category={category} onAddToCart={addToCart} />
      </section>

      <section className="about-strip">
        <div className="about-strip-inner">
          <div>
            <h3>Free Shipping</h3>
            <p>On orders above IDR 500,000</p>
          </div>
          <div>
            <h3>Easy Returns</h3>
            <p>30-day hassle-free returns</p>
          </div>
          <div>
            <h3>Sustainable</h3>
            <p>Ethically made, mindfully sourced</p>
          </div>
          <div>
            <h3>Secure Payment</h3>
            <p>All major payment methods accepted</p>
          </div>
        </div>
      </section>

      <Footer />

      {cartOpen && (
        <Cart
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      )}
    </div>
  );
}
