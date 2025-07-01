import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
const router = Router();
const pm = new ProductManager('products.json');

router.get('/', async (req, res) => {
  res.json(await pm.getProducts());
});

router.get('/:pid', async (req, res) => {
  const prod = await pm.getProductById(req.params.pid);
  if (!prod) return res.status(404).json({ error: 'No se encontró' });
  res.json(prod);
});

router.post('/', async (req, res) => {
  const p = await pm.addProduct(req.body);
  res.status(201).json(p);
});

router.put('/:pid', async (req, res) => {
  const p = await pm.updateProduct(req.params.pid, req.body);
  if (!p) return res.status(404).json({ error: 'No existe' });
  res.json(p);
});

router.delete('/:pid', async (req, res) => {
  const ok = await pm.deleteProduct(req.params.pid);
  if (!ok) return res.status(404).json({ error: 'No existe' });
  res.json({ message: 'Eliminado' });
});

export default router;