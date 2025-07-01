import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
const router = Router();
const cm = new CartManager('carts.json');

router.post('/', async (req, res) => {
  const c = await cm.createCart();
  res.status(201).json(c);
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'No existe' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cm.addProductToCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).json({ error: 'Carrito o producto no existe' });
  res.json(cart);
});

export default router;