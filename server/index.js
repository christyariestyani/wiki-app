const express = require('express');
const cors = require('cors');
const products = require('./data/products.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category && category !== 'all') {
    return res.json(products.filter(p => p.category === category));
  }
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  const categories = ['all', ...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
