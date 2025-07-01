import fs from 'fs/promises'; 

export default class ProductManager {
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

  async getProducts() {
    return this._read();
  }

  async getProductById(id) {
    return (await this._read()).find(p => p.id === id);
  }

  async addProduct(prod) {
    const prods = await this._read();
    const newProd = { ...prod, id: String(Date.now()) };
    prods.push(newProd);
    await this._write(prods);
    return newProd;
  }

  async updateProduct(id, updates) {
    const prods = await this._read();
    const idx = prods.findIndex(p => p.id === id);
    if (idx < 0) return null;
    delete updates.id;
    prods[idx] = { ...prods[idx], ...updates };
    await this._write(prods);
    return prods[idx];
  }

  async deleteProduct(id) {
    const prods = await this._read();
    const filtered = prods.filter(p => p.id !== id);
    if (filtered.length === prods.length) return false;
    await this._write(filtered);
    return true;
  }
}