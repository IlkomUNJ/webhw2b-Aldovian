 import type { HttpContext } from '@adonisjs/core/http'
import WishlistItem from '#models/wishlist_item'

export default class WishlistController {
  /**
   * Menampilkan halaman wishlist untuk pengguna.
   */
  async index({ view }: HttpContext) {
    const wishlistItems = await WishlistItem.query().preload('product')
    return view.render('pages/wishlist', { wishlistItems })
  }

  /**
   * Menambahkan item baru ke wishlist.
   */
  async store({ request, response }: HttpContext) {
    const { productId } = request.only(['productId'])
    
    await WishlistItem.firstOrCreate({ productId: productId })

    return response.redirect().back()
  }

  /**
   * Menghapus item dari wishlist.
   */
  async destroy({ params, response }: HttpContext) {
    const wishlistItem = await WishlistItem.findOrFail(params.id)
    await wishlistItem.delete()
    
    return response.redirect().toRoute('wishlist.index')
  }
      
  /**
   * Menampilkan semua item wishlist untuk dilihat oleh admin.
   */
  async adminIndex({ view }: HttpContext) {
    const wishlistItems = await WishlistItem.query().preload('product')
    return view.render('pages/admin_wishlist', { wishlistItems })
  }
}
