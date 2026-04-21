const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function Cart({ items, onClose, onRemove, onUpdateQty, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} />
      <aside className="cart-drawer">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">&#x2715;</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(item => (
                <li key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                    <div className="cart-item-qty">
                      <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>&#8722;</button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>&#43;</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => onRemove(item.id)} aria-label="Remove">&#x2715;</button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="btn-primary full-width" onClick={onCheckout}>Checkout</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
