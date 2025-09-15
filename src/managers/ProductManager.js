const Product = require('../models/Product');

class ProductManager {
  async getById(id) {
    try { return await Product.findById(id); }
    catch { return null; }
  }

  async create(data) {
    const p = await Product.create(data || {});
    return p;
  }

  async update(id, updates) {
    if (updates && updates._id) delete updates._id;
    const p = await Product.findByIdAndUpdate(id, updates, { new: true });
    return p;
  }

  async delete(id) {
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  }
}

module.exports = ProductManager;