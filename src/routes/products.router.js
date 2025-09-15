const express = require('express');
const Product = require('../models/Product');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const pm = new ProductManager();


function buildLink(base, queryObj) {
const u = new URL(base, 'http://localhost');
Object.entries(queryObj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) u.searchParams.set(k, v);
});
return u.pathname + (u.search ? u.search : '');
}


router.get('/', async (req, res) => {
try {
    const {
    limit = 10,
    page = 1,
    sort,    
    query    
    } = req.query;

    
    const filter = {};
    if (query) {
    const [k, v] = String(query).split(':');
    if (k === 'category' && v) filter.category = v;
    if (k === 'status') filter.status = v === 'true';
    }

    // Orden
    let sortOpt = undefined;
    if (sort === 'asc') sortOpt = { price: 1 };
    if (sort === 'desc') sortOpt = { price: -1 };

    const lim = Number(limit) || 10;
    const pg = Number(page) || 1;

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / lim));
    const skip = (pg - 1) * lim;

    const payload = await Product.find(filter)
    .sort(sortOpt || {})
    .skip(skip)
    .limit(lim);

    const basePath = '/api/products';
    const qBase = { limit: lim, sort: sort || undefined, query: query || undefined };

    const hasPrevPage = pg > 1;
    const hasNextPage = pg < totalPages;

    const prevPage = hasPrevPage ? pg - 1 : null;
    const nextPage = hasNextPage ? pg + 1 : null;

    const prevLink = hasPrevPage ? buildLink(basePath, { ...qBase, page: prevPage }) : null;
    const nextLink = hasNextPage ? buildLink(basePath, { ...qBase, page: nextPage }) : null;

    res.json({
    status: 'success',
    payload,
    totalPages,
    prevPage,
    nextPage,
    page: pg,
    hasPrevPage,
      hasNextPage,
    prevLink,
    nextLink
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', error: 'Algo salió mal' });
  }
});


router.get('/:pid', async (req, res) => {
  const prod = await pm.getById(req.params.pid);
  if (!prod) return res.status(404).json({ status: 'error', error: 'No encontrado' });
  res.json({ status: 'success', payload: prod });
});


router.post('/', async (req, res) => {
  const p = await pm.create(req.body);
  req.app.get('io').emit('productsUpdated', await Product.find({}));
  res.status(201).json({ status: 'success', payload: p });
});


router.put('/:pid', async (req, res) => {
  const p = await pm.update(req.params.pid, req.body);
  if (!p) return res.status(404).json({ status: 'error', error: 'No existe' });
  req.app.get('io').emit('productsUpdated', await Product.find({}));
  res.json({ status: 'success', payload: p });
});


router.delete('/:pid', async (req, res) => {
  const ok = await pm.delete(req.params.pid);
  if (!ok) return res.status(404).json({ status: 'error', error: 'No existe' });
  req.app.get('io').emit('productsUpdated', await Product.find({}));
  res.json({ status: 'success', message: 'Eliminado' });
});

module.exports = router;
