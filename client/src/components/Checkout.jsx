import { useState } from 'react';

const formatPrice = (p) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

const SHIPPING_COST = 25000;

const PAYMENT_METHODS = [
  { id: 'cod',  label: 'Cash on Delivery', desc: 'Bayar tunai saat pesanan tiba di rumah' },
  { id: 'qris', label: 'QRIS',             desc: 'Scan QR dengan e-wallet atau m-banking apapun' },
  { id: 'card', label: 'Kartu Kredit / Debit', desc: 'Visa, Mastercard, JCB' },
];

function QRCodeSVG() {
  const S = 9, P = 14, N = 21;
  const g = Array.from({ length: N }, () => Array(N).fill(0));

  const finder = (r0, c0) => {
    for (let r = r0; r < r0 + 7; r++) {
      for (let c = c0; c < c0 + 7; c++) {
        const dr = r - r0, dc = c - c0;
        g[r][c] = (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)) ? 1 : 0;
      }
    }
  };
  finder(0, 0); finder(0, N - 7); finder(N - 7, 0);

  for (let i = 8; i < N - 8; i++) {
    g[6][i] = i % 2 === 0 ? 1 : 0;
    g[i][6] = i % 2 === 0 ? 1 : 0;
  }
  g[N - 8][8] = 1;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inF1 = r <= 7 && c <= 7;
      const inF2 = r <= 7 && c >= N - 8;
      const inF3 = r >= N - 8 && c <= 7;
      if (!inF1 && !inF2 && !inF3 && r !== 6 && c !== 6 && g[r][c] === 0) {
        g[r][c] = ((r * 11 + c * 7 + r * c * 3) % 5 < 2) ? 1 : 0;
      }
    }
  }

  const W = N * S + P * 2;
  return (
    <svg width={W} height={W} viewBox={`0 0 ${W} ${W}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={W} height={W} fill="white" rx="4" />
      {g.flatMap((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c * S + P} y={r * S + P} width={S} height={S} fill="#1a1a1a" /> : null
        )
      )}
    </svg>
  );
}

export default function Checkout({ items, onClose, onSuccess }) {
  const [step, setStep]   = useState(1);
  const [method, setMethod] = useState('cod');
  const [form, setForm]   = useState({ name: '', email: '', phone: '', address: '', city: '', postal: '' });
  const [card, setCard]   = useState({ number: '', holder: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 500000 ? 0 : SHIPPING_COST;
  const total    = subtotal + shipping;

  const sf = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };
  const sc = (f, v) => { setCard(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const validateShipping = () => {
    const e = {};
    if (!form.name.trim())                              e.name    = 'Nama wajib diisi';
    if (!/\S+@\S+\.\S+/.test(form.email))              e.email   = 'Email tidak valid';
    if (!form.phone.trim())                             e.phone   = 'Nomor telepon wajib diisi';
    if (!form.address.trim())                           e.address = 'Alamat wajib diisi';
    if (!form.city.trim())                              e.city    = 'Kota wajib diisi';
    if (!form.postal.trim())                            e.postal  = 'Kode pos wajib diisi';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateCard = () => {
    if (method !== 'card') return true;
    const e = {};
    if (card.number.replace(/\s/g, '').length < 16) e.number = 'Nomor kartu harus 16 digit';
    if (!card.holder.trim())                        e.holder = 'Nama pemegang kartu wajib diisi';
    if (!/^\d{2}\/\d{2}$/.test(card.expiry))       e.expiry = 'Format MM/YY';
    if (card.cvv.length < 3)                        e.cvv    = 'CVV harus 3–4 digit';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = () => {
    if (step === 1 && validateShipping()) setStep(2);
    if (step === 2 && validateCard())     setStep(3);
  };

  const fmtCard = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExp  = (v) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  const methodLabel = PAYMENT_METHODS.find(m => m.id === method)?.label;

  /* ── Step 3: Sukses ── */
  if (step === 3) return (
    <div className="checkout-backdrop">
      <div className="checkout-modal">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h2>Pesanan Dikonfirmasi!</h2>
          <p>Terima kasih, <strong>{form.name}</strong>. Pesananmu sedang diproses.</p>
          <p>Konfirmasi dikirim ke <strong>{form.email}</strong></p>
          <div className="success-detail">
            <div className="success-row"><span>Metode Pembayaran</span><span>{methodLabel}</span></div>
            <div className="success-row"><span>Total</span><span>{formatPrice(total)}</span></div>
            <div className="success-row"><span>Alamat</span><span>{form.address}, {form.city} {form.postal}</span></div>
          </div>
          <button className="btn-primary" onClick={() => { onSuccess(); onClose(); }}>
            Kembali Belanja
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="checkout-modal">
        <button className="checkout-close" onClick={onClose} aria-label="Tutup">&#x2715;</button>

        {/* Header + Steps */}
        <div className="checkout-header">
          <h2>Checkout</h2>
          <div className="checkout-steps">
            <div className={`checkout-step ${step === 1 ? 'active' : 'done'}`}>
              <span className="step-num">{step > 1 ? '✓' : '1'}</span>
              <span>Info Pengiriman</span>
            </div>
            <span className="step-divider" />
            <div className={`checkout-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
              <span className="step-num">2</span>
              <span>Pembayaran</span>
            </div>
          </div>
        </div>

        <div className="checkout-body">
          {/* ── Form Area ── */}
          <div className="checkout-form-area">

            {/* Step 1 — Info Pengiriman */}
            {step === 1 && (
              <>
                <p className="form-section-title">Informasi Pengiriman</p>

                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input value={form.name} onChange={e => sf('name', e.target.value)} className={errors.name ? 'error' : ''} placeholder="Jane Doe" />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={e => sf('email', e.target.value)} className={errors.email ? 'error' : ''} placeholder="jane@email.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Nomor Telepon</label>
                    <input value={form.phone} onChange={e => sf('phone', e.target.value)} className={errors.phone ? 'error' : ''} placeholder="08xxxxxxxxxx" />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Alamat Lengkap</label>
                  <input value={form.address} onChange={e => sf('address', e.target.value)} className={errors.address ? 'error' : ''} placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan" />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kota</label>
                    <input value={form.city} onChange={e => sf('city', e.target.value)} className={errors.city ? 'error' : ''} placeholder="Jakarta" />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>Kode Pos</label>
                    <input value={form.postal} onChange={e => sf('postal', e.target.value)} className={errors.postal ? 'error' : ''} placeholder="12345" />
                    {errors.postal && <span className="form-error">{errors.postal}</span>}
                  </div>
                </div>
              </>
            )}

            {/* Step 2 — Pembayaran */}
            {step === 2 && (
              <>
                <p className="form-section-title">Pilih Metode Pembayaran</p>

                <div className="payment-methods">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className={`payment-method-option ${method === m.id ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                      <span className="radio-dot" />
                      <span className="payment-method-label">
                        <h4>{m.label}</h4>
                        <p>{m.desc}</p>
                      </span>
                      {m.id === 'card' && <span className="card-logos"><span>VISA</span><span>MC</span></span>}
                      {m.id === 'qris' && <span className="qris-badge">QRIS</span>}
                    </label>
                  ))}
                </div>

                {/* COD */}
                {method === 'cod' && (
                  <div className="cod-info">
                    <p><strong>Bayar tunai saat pesanan tiba.</strong></p>
                    <p>Siapkan uang sebesar <strong>{formatPrice(total)}</strong>. Kurir akan menghubungimu sebelum pengiriman.</p>
                  </div>
                )}

                {/* QRIS */}
                {method === 'qris' && (
                  <div className="qris-box">
                    <p className="qris-scan-label">Scan untuk membayar</p>
                    <QRCodeSVG />
                    <strong className="qris-amount">{formatPrice(total)}</strong>
                    <p className="qris-note">Berlaku 15 menit · GoPay · OVO · DANA · ShopeePay · m-Banking</p>
                  </div>
                )}

                {/* Kartu Kredit */}
                {method === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Nomor Kartu</label>
                      <input value={card.number} onChange={e => sc('number', fmtCard(e.target.value))} className={errors.number ? 'error' : ''} placeholder="1234 5678 9012 3456" maxLength={19} />
                      {errors.number && <span className="form-error">{errors.number}</span>}
                    </div>
                    <div className="form-group">
                      <label>Nama Pemegang Kartu</label>
                      <input value={card.holder} onChange={e => sc('holder', e.target.value.toUpperCase())} className={errors.holder ? 'error' : ''} placeholder="JANE DOE" />
                      {errors.holder && <span className="form-error">{errors.holder}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Berlaku Sampai</label>
                        <input value={card.expiry} onChange={e => sc('expiry', fmtExp(e.target.value))} className={errors.expiry ? 'error' : ''} placeholder="MM/YY" maxLength={5} />
                        {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="password" value={card.cvv} onChange={e => sc('cvv', e.target.value.replace(/\D/g,'').slice(0,4))} className={errors.cvv ? 'error' : ''} placeholder="•••" maxLength={4} />
                        {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                      </div>
                    </div>
                    <p className="card-secure-note">🔒 Transaksi dienkripsi dengan SSL 256-bit</p>
                  </div>
                )}
              </>
            )}

            {/* Nav */}
            <div className="checkout-nav">
              {step > 1
                ? <button className="btn-back" onClick={() => setStep(s => s - 1)}>← Kembali</button>
                : <span />
              }
              <button className="btn-primary" onClick={handleNext}>
                {step === 1 ? 'Lanjut ke Pembayaran →' : 'Konfirmasi Pesanan'}
              </button>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="checkout-summary">
            <h3>Ringkasan Pesanan</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} className="summary-item-img" />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-meta">Qty: {item.qty}</p>
                  </div>
                  <p className="summary-item-price">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row">
              <span>Ongkos Kirim</span>
              <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
            </div>
            {shipping === 0 && <p className="summary-free-note">✓ Gratis ongkir di atas IDR 500.000</p>}
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
