import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const WishlistPage: React.FC = () => {
  const { wishlist, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { user, loading: authLoading } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      // İstek listesinden otomatik kaldırma kısmını kaldırdık
      // Kullanıcılar bir ürünü hem istek listesinde tutabilir hem de sepete ekleyebilir
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  if (authLoading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view your wishlist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

        {wishlist.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-4">
              Start adding items to your wishlist by clicking the heart icon on products you love.
            </p>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                
                <div className="p-4">
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 mb-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-500 text-sm mb-2">
                    Added on {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                  
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    {formatPrice(item.product.price)}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      onClick={() => handleAddToCart(item.productId)}
                      isLoading={cartLoading}
                      disabled={item.product.stock === 0}
                      fullWidth
                      className="flex items-center justify-center rounded-full"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="flex items-center justify-center rounded-full"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;