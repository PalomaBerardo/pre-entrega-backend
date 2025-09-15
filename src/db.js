const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { dbName: 'ecommerce' });
    console.log('MongoDB conectado');
  } catch (e) {
    console.error('Error conectando a MongoDB:', e.message);
    process.exit(1);
  }
}

module.exports = { connectDB };