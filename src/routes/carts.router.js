const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cm = new CartManager();


router.post('/', async (req, res) => {
  const c = await cm.createCart();
  res.status(201).json({ status: 'success', payload: c });
});


router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'No existe' });
  res.json({ status: 'success', payload: cart });
});


router.post('/:cid/product/:pid', async (req, res) => {
  const qty = Number(req.body?.quantity) || 1;
  const cart = await cm.addProductToCart(req.params.cid, req.params.pid, qty);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito o producto no existe' });
  res.json({ status: 'success', payload: cart });
});


router.delete('/:cid/products/:pid', async (req, res) => {
  const cart = await cm.removeProduct(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito o producto no existe' });
  res.json({ status: 'success', payload: cart });
});


router.put('/:cid', async (req, res) => {
  const arr = Array.isArray(req.body) ? req.body : (req.body?.products || []);
  const cart = await cm.updateAllProducts(req.params.cid, arr);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no existe' });
  res.json({ status: 'success', payload: cart });
});


router.put('/:cid/products/:pid', async (req, res) => {
  const q = Number(req.body?.quantity);
  const cart = await cm.updateProductQty(req.params.cid, req.params.pid, q);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito o producto no existe' });
  res.json({ status: 'success', payload: cart });
});


router.delete('/:cid', async (req, res) => {
  const cart = await cm.clearCart(req.params.cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Carrito no existe' });
  res.json({ status: 'success', payload: cart });
});

module.exports = router;
