export default function Banner({ onShop }) {
  return (
    <section className="banner">
      <div className="banner-grid">
        <div className="banner-item banner-item-large">
          <img
            src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80"
            alt="New Collection"
          />
          <div className="banner-text">
            <h2>New Collection</h2>
            <button className="btn-outline" onClick={() => onShop('dresses')}>Shop Dresses</button>
          </div>
        </div>
        <div className="banner-col">
          <div className="banner-item">
            <img
              src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80"
              alt="Tops"
            />
            <div className="banner-text">
              <h2>Tops</h2>
              <button className="btn-outline" onClick={() => onShop('tops')}>Shop Now</button>
            </div>
          </div>
          <div className="banner-item">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
              alt="Sale"
            />
            <div className="banner-text">
              <h2>Sale</h2>
              <button className="btn-outline" onClick={() => onShop('all')}>Shop Sale</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
