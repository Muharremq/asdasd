import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/products/${product.id}` } });
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/products/${product.id}` } });
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <button
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isInWishlist(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-red-500'
          } transition-colors shadow-sm`}
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
          />
        </button>
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center text-amber-500">
            <Star size={16} fill="currentColor" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount} reviews)</span>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          
          <Button 
            variant="primary" 
            size="sm" 
            className="flex items-center rounded-full" 
            onClick={handleAddToCart}
            isLoading={cartLoading}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={16} className="mr-1" />
            {product.stock === 0 ? 'Out of Stock' : 'Add'}
          </Button>
        </div>
        
        {product.stock < 10 && product.stock > 0 && (
          <p className="mt-2 text-sm text-orange-600">
            Only {product.stock} left in stock
          </p>
        )}
        
        {product.stock === 0 && (
          <p className="mt-2 text-sm text-red-600">
            Out of stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;