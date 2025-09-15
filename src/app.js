const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const { connectDB } = require('./db');
const Product = require('./models/Product');
const ProductManager = require('./managers/ProductManager');

require('dotenv').config();

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const server = createServer(app);
const io = new Server(server);
const pm = new ProductManager();

const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine({
  helpers: {
    eq: (a,b) => a==b,
    gt: (a,b) => a>b,
    lt: (a,b) => a<b,
    inc: (v) => Number(v)+1,
    dec: (v) => Number(v)-1,
    mul: (a,b) => Number(a)*Number(b)
  }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.set('io', io);

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

io.on('connection', async (socket) => {
  console.log('Cliente conectado');
  socket.emit('productsUpdated', await Product.find({}));

  socket.on('newProduct', async (prod) => {
    console.log('Nuevo producto por socket', prod);
    await pm.create(prod || {});
    io.emit('productsUpdated', await Product.find({}));
  });

  socket.on('deleteProduct', async (id) => {
    console.log('Eliminar por socket', id);
    await pm.delete(id);
    io.emit('productsUpdated', await Product.find({}));
  });
});

connectDB(MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log('Servidor corriendo en puerto ' + PORT);
  });
});