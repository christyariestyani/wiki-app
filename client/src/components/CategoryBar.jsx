const categories = [
  { label: 'All', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Outerwear', value: 'outerwear' },
];

export default function CategoryBar({ active, onChange }) {
  return (
    <div className="category-bar">
      {categories.map(cat => (
        <button
          key={cat.value}
          className={`cat-btn ${active === cat.value ? 'active' : ''}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
