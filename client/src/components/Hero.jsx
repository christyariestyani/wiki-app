export default function Hero({ onShopNow }) {
  return (
    <section className="hero">
      <div className="hero-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80"
          alt="Shop at Christy — Modern, functional, simple"
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <p className="hero-eyebrow">New Arrivals</p>
        <h1 className="hero-title">Modern. Minimal.<br />Effortlessly You.</h1>
        <p className="hero-sub">Contemporary casual womenswear for every moment.</p>
        <button className="btn-primary" onClick={onShopNow}>
          Shop the Collection
        </button>
      </div>
    </section>
  );
}
