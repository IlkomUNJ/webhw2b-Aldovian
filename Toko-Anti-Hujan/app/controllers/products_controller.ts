import router from '@adonisjs/core/services/router'

// Menggunakan path relatif tanpa ekstensi file
import ProductController from '../app/controllers/product_controller'
import WishlistController from '../app/controllers/wishlist_controller'

// Rute untuk halaman statis
router.on('/').render('pages/home')
router.on('/tentang').render('pages/tentang')

// --- Rute untuk Produk ---
// Menampilkan semua produk & menangani pencarian
router.get('/produk', [ProductController, 'index'])
// Menampilkan detail satu produk
router.get('/produk/:id', [ProductController, 'show'])

// --- Rute untuk Wishlist Pengguna ---
// Menampilkan halaman wishlist
router.get('/wishlist', [WishlistController, 'index']).as('wishlist.index')
// Menambahkan item ke wishlist
router.post('/wishlist', [WishlistController, 'store']).as('wishlist.store')
// Menghapus item dari wishlist
router.delete('/wishlist/:id', [WishlistController, 'destroy']).as('wishlist.destroy')

// --- Grup Rute untuk Admin ---
router
  .group(() => {
    // Menampilkan form tambah produk
    router.get('/produk/tambah', [ProductController, 'create'])
    // Menyimpan produk baru
    router.post('/produk', [ProductController, 'store'])

    // Menampilkan laporan semua wishlist
    router.get('/wishlist', [WishlistController, 'adminIndex'])
  })
  .prefix('/admin')

