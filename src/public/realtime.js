const socket = io();
const list = document.getElementById('productsList');
const createForm = document.getElementById('createForm');
const deleteForm = document.getElementById('deleteForm');

socket.on('productsUpdated', (products) => {
  list.innerHTML = '';
  (products || []).forEach(p => {
    const li = document.createElement('li');
    li.textContent = (p.title || '') + ' - $' + (p.price || 0) + ' (ID: ' + (p._id || '') + ')';
    list.appendChild(li);
  });
});

createForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(createForm));
  data.price = Number(data.price);
  socket.emit('newProduct', data);
  createForm.reset();
});

deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = new FormData(deleteForm).get('id');
  socket.emit('deleteProduct', id);
  deleteForm.reset();
});