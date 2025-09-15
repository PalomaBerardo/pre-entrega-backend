const Cart = require('../models/Cart');

class CartManager {
async createCart() {
const c = await Cart.create({ products: [] });
return c;
}

async getCartById(cid) {
try {
return await Cart.findById(cid).populate('products.product');
} catch {
return null;
}
}

async addProductToCart(cid, pid, qty = 1) {
const cart = await Cart.findById(cid);
    if (!cart) return null;

    const item = cart.products.find(p => String(p.product) === String(pid));
    if (item) item.quantity += qty;
    else cart.products.push({ product: pid, quantity: qty });

    await cart.save();
    return cart;
}

async updateAllProducts(cid, productsArray = []) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    
    cart.products = productsArray.map(p => ({
    product: p.product,
    quantity: Number(p.quantity) || 1
    }));
    await cart.save();
    return cart;
}
async updateProductQty(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    const item = cart.products.find(p => String(p.product) === String(pid));
    if (!item) return null;
    item.quantity = Number(quantity) || 1;
    await cart.save();
    return cart;
}

async removeProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = cart.products.filter(p => String(p.product) !== String(pid));
    await cart.save();
    return cart;
}

async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return cart;
}
}

module.exports = CartManager;