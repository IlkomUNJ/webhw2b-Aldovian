/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')
router.on('/produk').render('pages/produk')
router.on('/payung').render('pages/payung')
router.on('/jas').render('pages/jas')
router.on('/bundling').render('pages/bundling')
router.on('/tentang').render('pages/tentang')
router.on('/wishlist').render('pages/wishlist')
router.on('/keranjang').render('pages/keranjang')