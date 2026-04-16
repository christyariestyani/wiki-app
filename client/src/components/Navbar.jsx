import { useState } from 'react';

export default function Navbar({ cartCount, onCartOpen, onCategoryChange, activeCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', value: 'all' },
    { label: 'Tops', value: 'tops' },
    { label: 'Bottoms', value: 'bottoms' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Outerwear', value: 'outerwear' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <a href="/" className="logo">Shop at Christy</a>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <button
              key={link.value}
              className={`nav-link ${activeCategory === link.value ? 'active' : ''}`}
              onClick={() => {
                onCategoryChange(link.value);
                setMenuOpen(false);
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button className="cart-btn" onClick={onCartOpen} aria-label="Cart">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
