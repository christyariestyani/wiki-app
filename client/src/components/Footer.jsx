export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Shop at Christy</h3>
          <p>Modern, functional, and simple design for women.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <ul>
              <li>New Arrivals</li>
              <li>Tops</li>
              <li>Bottoms</li>
              <li>Dresses</li>
              <li>Outerwear</li>
              <li>Sale</li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li>FAQ</li>
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li>Our Story</li>
              <li>Sustainability</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Shop at Christy. All rights reserved.</p>
      </div>
    </footer>
  );
}
