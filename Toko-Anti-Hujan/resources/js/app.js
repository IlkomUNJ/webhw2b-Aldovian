// UNTUK SEMUA HALAMAN

// --- FUNGSI KERANJANG ---
function getCart() {
  return JSON.parse(localStorage.getItem('tokoAntiHujanCart')) || [];
}
function saveCart(cart) {
  localStorage.setItem('tokoAntiHujanCart', JSON.stringify(cart));
  updateCartCount(); 
}
function updateCartCount() {
  const cart = getCart();
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    if (totalQuantity > 0) {
      el.textContent = totalQuantity;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

// --- FUNGSI WISHLIST ---
function getWishlist() {
  return JSON.parse(localStorage.getItem('tokoAntiHujanWishlist')) || [];
}
function saveWishlist(wishlist) {
  localStorage.setItem('tokoAntiHujanWishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}
function updateWishlistCount() {
  const wishlist = getWishlist();
  const wishlistCountElements = document.querySelectorAll('.wishlist-count');
  wishlistCountElements.forEach(el => {
    if (wishlist.length > 0) {
      el.textContent = wishlist.length;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}
function isInWishlist(productName) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.name === productName);
}


// --- INSIALISASI SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount(); 
  updateWishlistCount(); 
});


// UNTUK HALAMAN DETAIL PRODUK
if (document.querySelector('.produk-detail')) {
  
  const wishlistBtn = document.getElementById('btn-add-wishlist');
  const cartBtn = document.getElementById('btn-add-cart');
  const modal = document.getElementById('popup-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');
  const productNameEl = document.getElementById('product-name');
  const productImgEl = document.getElementById('product-image');
  const productPriceEl = document.querySelector('.detail-info .harga');
  const qtyInput = document.getElementById('quantity-input');
  const qtyPlus = document.getElementById('btn-qty-plus');
  const qtyMinus = document.getElementById('btn-qty-minus');

  if (wishlistBtn && cartBtn && modal && productNameEl && productImgEl && productPriceEl && qtyInput && qtyPlus && qtyMinus) {
    
    const productName = productNameEl.textContent;
    const productImgSrc = productImgEl.src;
    const productPrice = parseInt(productPriceEl.textContent.replace(/[^0-9]/g, ''));
    const productLink = window.location.pathname.split('/').pop(); 

    // Set ikon hati sesuai status wishlist
    const wishlistIcon = wishlistBtn.querySelector('i');
    if (wishlistIcon && isInWishlist(productName)) {
        wishlistIcon.classList.remove('far');
        wishlistIcon.classList.add('fas');
    }

    // Event listener kuantitas +/-
    qtyPlus.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value) || 0;
      qtyInput.value = currentVal + 1;
    });
    qtyMinus.addEventListener('click', () => {
      let currentVal = parseInt(qtyInput.value) || 1;
      if (currentVal > 1) qtyInput.value = currentVal - 1;
    });

    // Fungsi buka/tutup modal
    function openModal(type, message = '') { 
      const modalTitle = document.getElementById('modal-title');
      const modalImg = document.getElementById('modal-product-image');
      const modalName = document.getElementById('modal-product-name');
      let modalActionBtn = document.getElementById('modal-action-btn');
      
      if (!modalActionBtn && modal.querySelector('.modal-product-info')) {
         modalActionBtn = document.createElement('a');
         modalActionBtn.href="#"; 
         modalActionBtn.id = "modal-action-btn";
         modalActionBtn.className = "btn-beli"; 
         modal.querySelector('.modal-product-info').insertAdjacentElement('afterend', modalActionBtn);
      }

      if(modalImg) modalImg.src = productImgSrc;
      if(modalName) modalName.textContent = message || productName; 

      if (type === 'wishlist-added') {
        if(modalTitle) modalTitle.textContent = 'Ditambahkan ke Wishlist!';
        if(modalActionBtn) {
            modalActionBtn.textContent = 'Lihat Wishlist';
            modalActionBtn.href = 'wishlist'; 
            modalActionBtn.style.display = 'inline-block';
        }
      } else if (type === 'wishlist-removed') {
        if(modalTitle) modalTitle.textContent = 'Dihapus dari Wishlist';
         if(modalActionBtn) modalActionBtn.style.display = 'none'; 
      } else if (type === 'cart-new') {
        if(modalTitle) modalTitle.textContent = 'Sukses Ditambahkan ke Keranjang!';
        if(modalActionBtn) {
            modalActionBtn.textContent = 'Lihat Keranjang';
            modalActionBtn.href = 'keranjang';
            modalActionBtn.style.display = 'inline-block';
        }
      } else if (type === 'cart-updated') {
        if(modalTitle) modalTitle.textContent = 'Jumlah Diperbarui di Keranjang!';
        if(modalActionBtn) {
            modalActionBtn.textContent = 'Lihat Keranjang';
            modalActionBtn.href = 'keranjang';
            modalActionBtn.style.display = 'inline-block';
        }
      }

      if(modal && overlay) { 
          modal.classList.remove('hidden');
          overlay.classList.remove('hidden');
      }
    }

    function closeModal() {
       if(modal && overlay) { 
           modal.classList.add('hidden');
           overlay.classList.add('hidden');
       }
    }

    // Event listener tombol wishlist (simpan/hapus)
    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      const icon = wishlistBtn.querySelector('i');
      if (!icon) return;

      let wishlist = getWishlist();
      const itemIndex = wishlist.findIndex(item => item.name === productName);

      if (icon.classList.contains('fas')) { 
        if (itemIndex > -1) wishlist.splice(itemIndex, 1); 
        icon.classList.remove('fas');
        icon.classList.add('far');
        openModal('wishlist-removed', `${productName} dihapus dari wishlist.`);
      } else { 
        if (itemIndex === -1) { 
          wishlist.push({ name: productName, image: productImgSrc, link: productLink });
        }
        icon.classList.remove('far');
        icon.classList.add('fas');
        openModal('wishlist-added');
      }
      saveWishlist(wishlist); 
    });

    // Event listener tombol keranjang
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      let cart = getCart();
      let existingItem = cart.find(item => item.name === productName);
      let quantityToAdd = parseInt(qtyInput.value) || 1;
      
      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        openModal('cart-updated');
      } else {
        cart.push({ name: productName, image: productImgSrc, price: productPrice, quantity: quantityToAdd });
        openModal('cart-new'); 
      }
      saveCart(cart); 
      qtyInput.value = 1; 
    });

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(overlay) overlay.addEventListener('click', closeModal);
  }
}


// UNTUK HALAMAN KERANJANG
if (document.getElementById('cart-page-container')) {
  
  const container = document.getElementById('cart-page-container');
  const totalSummaryEl = document.getElementById('cart-total-summary');
  const checkoutBtn = document.getElementById('btn-checkout');

  function checkoutViaWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) { alert('Keranjang Anda kosong!'); return; }
    const yourWhatsAppNumber = '6281234567890';
    let messageText = 'Halo Toko Anti Hujan, saya ingin memesan:\n';
    let totalHarga = 0;
    cart.forEach(item => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      const itemTotal = price * quantity;
      messageText += `\n- ${item.name} (Qty: ${quantity}) - Rp ${itemTotal.toLocaleString('id-ID')}`;
      totalHarga += itemTotal;
    });
    messageText += `\n\nTotal: Rp ${totalHarga.toLocaleString('id-ID')}\n\nMohon info cara pembayarannya. Terima kasih.`;
    const encodedMessage = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  }

  function renderCart() {
    let cart = getCart();
    if (!container) return; 
    if (cart.length === 0) {
      container.innerHTML = '<p style="text-align: center;">Keranjang Anda kosong.</p>';
      if (totalSummaryEl) totalSummaryEl.innerHTML = '';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      return;
    }
    let totalHarga = 0;
    container.innerHTML = ''; 
    cart.forEach(item => {
      const quantity = item.quantity || 1;
      const price = item.price || 0; 
      const itemTotal = price * quantity;
      totalHarga += itemTotal;
      const itemEl = document.createElement('div');
      itemEl.classList.add('cart-item');
      itemEl.dataset.name = item.name; 
      itemEl.innerHTML = `
        <img src="${item.image || 'gambar/placeholder.jpg'}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>Rp ${price.toLocaleString('id-ID')}</p>
          <p class="cart-item-subtotal">Subtotal: Rp ${itemTotal.toLocaleString('id-ID')}</p>
        </div>
        <div class="cart-quantity-controls">
          <button class="btn-icon btn-minus" data-name="${item.name}">-</button>
          <input type="number" class="cart-item-qty-input" value="${quantity}" min="1" data-name="${item.name}">
          <button class="btn-icon btn-plus" data-name="${item.name}">+</button>
        </div>
        <button class="btn-icon btn-remove" data-name="${item.name}" title="Hapus item">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;
      container.appendChild(itemEl);
    });
    if (totalSummaryEl) {
      totalSummaryEl.innerHTML = `<h3>Total Belanja: <span>Rp ${totalHarga.toLocaleString('id-ID')}</span></h3>`;
    }
    if (checkoutBtn) checkoutBtn.style.display = 'inline-flex';
  }
  
  function updateCartQuantity(productName, newQuantity) {
    let cart = getCart();
    let itemIndex = cart.findIndex(item => item.name === productName);
    if (itemIndex === -1) return;
    if (newQuantity < 1) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = newQuantity;
    }
    saveCart(cart);
    renderCart();
  }

  if (container) {
      container.addEventListener('click', function(e) {
        const targetButton = e.target.closest('button');
        if (!targetButton) return;
        const productName = targetButton.dataset.name;
        if (!productName) return;
        let item = getCart().find(i => i.name === productName);
        if (!item) return;
        if (targetButton.classList.contains('btn-plus')) {
          updateCartQuantity(productName, item.quantity + 1);
        } else if (targetButton.classList.contains('btn-minus')) {
          updateCartQuantity(productName, item.quantity - 1);
        } else if (targetButton.classList.contains('btn-remove')) {
          updateCartQuantity(productName, 0); 
        }
      });
      container.addEventListener('change', function(e) {
        if (e.target.classList.contains('cart-item-qty-input')) {
          const productName = e.target.dataset.name;
          let newQuantity = parseInt(e.target.value);
          if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
          updateCartQuantity(productName, newQuantity);
        }
      });
  }
  if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function(e) {
          e.preventDefault(); 
          checkoutViaWhatsApp(); 
      });
  }
  renderCart();
}


// UNTUK HALAMAN WISHLIST
if (document.getElementById('wishlist-page-container')) {
  
  const container = document.getElementById('wishlist-page-container');

  function renderWishlist() {
    let wishlist = getWishlist();
    if (!container) return; 

    if (wishlist.length === 0) {
      container.innerHTML = '<p style="text-align: center;">Wishlist Anda kosong.</p>';
      return;
    }
    
    container.innerHTML = ''; 
    
    wishlist.forEach(item => {
      const itemEl = document.createElement('a'); 
      itemEl.href = item.link || '#'; 
      itemEl.classList.add('wishlist-item'); 
      itemEl.dataset.name = item.name; 

      itemEl.innerHTML = `
        <img src="${item.image || 'gambar/placeholder.jpg'}" alt="${item.name}">
        <h3>${item.name}</h3>
        <button class="btn-remove-wishlist" data-name="${item.name}" title="Hapus dari Wishlist">
          <i class="fas fa-times"></i> 
        </button>
      `;
      container.appendChild(itemEl);
    });
  }

  function removeFromWishlist(productName) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.name !== productName); 
    saveWishlist(wishlist); 
    renderWishlist(); 
  }

  if (container) {
    container.addEventListener('click', function(e) {
      const removeButton = e.target.closest('.btn-remove-wishlist');
      if (removeButton) {
        e.preventDefault(); 
        e.stopPropagation(); 
        const productName = removeButton.dataset.name;
        if (productName) {
          removeFromWishlist(productName);
        }
      }
    });
  }

  renderWishlist();
}