(function(){
  const cartSpan = document.getElementById('currentCartId');
  const verCarrito = document.getElementById('verCarrito');

  function refreshCartUI(){
    const cid = window.getCartId && window.getCartId();
    if (cartSpan) cartSpan.textContent = cid || '(sin cartId)';
    if (verCarrito && cid) verCarrito.href = '/carts/' + cid;
  }
  refreshCartUI();

  
  document.querySelectorAll('.addCartBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pid = btn.dataset.pid;
      const cid = window.getCartId && window.getCartId();
      if (!cid) { alert('Primero guarda un cartId'); return; }
      await fetch('/api/carts/' + cid + '/product/' + pid, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 })
      });
      alert('Agregado!');
    });
  });

  
  const agregarBtn = document.getElementById('agregarBtn');
  if (agregarBtn) {
    agregarBtn.addEventListener('click', async () => {
      const pid = agregarBtn.dataset.pid;
      const cid = window.getCartId && window.getCartId();
      if (!cid) { alert('Guardá el cartId primero'); return; }
      await fetch('/api/carts/' + cid + '/product/' + pid, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 })
      });
      alert('Agregado!');
    });
  }

  
  document.querySelectorAll('.btnUpdate').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const input = e.target.closest('td').querySelector('.qtyInput');
      const cid = input.dataset.cid;
      const pid = input.dataset.pid;
      const q = Number(input.value) || 1;
      await fetch('/api/carts/' + cid + '/products/' + pid, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: q })
      });
      alert('Cantidad actualizada');
      location.reload();
    });
  });

  document.querySelectorAll('.btnDelete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cid = btn.dataset.cid;
      const pid = btn.dataset.pid;
      await fetch('/api/carts/' + cid + '/products/' + pid, { method: 'DELETE' });
      alert('Producto eliminado del carrito');
      location.reload();
    });
  });

  const btnVaciar = document.getElementById('btnVaciar');
  if (btnVaciar) {
    btnVaciar.addEventListener('click', async () => {
      const cid = btnVaciar.dataset.cid;
      await fetch('/api/carts/' + cid, { method: 'DELETE' });
      alert('Carrito vaciado');
      location.reload();
    });
  }
})();