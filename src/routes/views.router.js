const express = require('express');
const Product = require('../models/Product');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cm = new CartManager();

router.get('/', async (req, res) => {
  const prods = await Product.find({}).sort({ createdAt: -1 }).limit(10);
  res.render('home', { title: 'Home', products: prods });
});

router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = {};
  if (query) {
    const [k, v] = String(query).split(':');
    if (k === 'category' && v) filter.category = v;
    if (k === 'status') filter.status = v === 'true';
  }

  let sortOpt = undefined;
  if (sort === 'asc') sortOpt = { price: 1 };
  if (sort === 'desc') sortOpt = { price: -1 };

  const lim = Number(limit) || 10;
  const pg = Number(page) || 1;
  const total = await Product.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / lim));
  const skip = (pg - 1) * lim;

  const products = await Product.find(filter).sort(sortOpt || {}).skip(skip).limit(lim);

  res.render('products', {
    title: 'Productos',
    products,
    page: pg,
    totalPages,
    limit: lim,
    sort: sort || '',
    query: query || ''
  });
});

router.get('/products/:pid', async (req, res) => {
  const product = await Product.findById(req.params.pid);
  if (!product) return res.status(404).send('Producto no encontrado');
  res.render('productDetail', { title: product.title, product });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).send('Carrito no encontrado');
  res.render('cart', { title: 'Carrito', cart });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Tiempo real' });
});

module.exports = router;

