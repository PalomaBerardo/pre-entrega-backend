import fs from 'fs/promises';

export default class CartManager {
  constructor(file) {
    this.file = file;
  }

  async _read() {
    try {
      return JSON.parse(await fs.readFile(this.file, 'utf-8'));
    } catch {
      return [];
    }
  }

  async _write(data) {
    await fs.writeFile(this.file, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._read();
    const newCart = { id: String(Date.now()), products: [] };
    carts.push(newCart);
    await this._write(carts);
    return newCart;
  }

  async getCartById(id) {
    return (await this._read()).find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this._read();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;
    const item = cart.products.find(p => p.product === pid);
    if (item) item.quantity++;
    else cart.products.push({ product: pid, quantity: 1 });
    await this._write(carts);
    return cart;
  }
}