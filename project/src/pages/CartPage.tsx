import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const CartPage: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleQuantityChange = async (productId: string, quantity: number) => {
    await updateCartItem(productId, quantity);
  };
  
  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { redirect: '/checkout' } });
    }
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <Button>
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                </div>
                
                <ul>
                  {cart.items.map((item) => (
                    <li key={item.productId} className="border-b border-gray-200 last:border-0">
                      <div className="p-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <Link to={`/products/${item.productId}`}>
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          </Link>
                        </div>
                        <div className="flex-1">
                          <Link 
                            to={`/products/${item.productId}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mb-4">
                            {item.product.category}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-24">
                              <label htmlFor={`quantity-${item.productId}`} className="sr-only">
                                Quantity
                              </label>
                              <select
                                id={`quantity-${item.productId}`}
                                value={item.quantity}
                                onChange={(e) => 
                                  handleQuantityChange(item.productId, parseInt(e.target.value))
                                }
                                className="w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                              >
                                {[...Array(10)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <button
                                onClick={() => handleRemoveItem(item.productId)}
                                className="text-gray-400 hover:text-red-500 flex items-center"
                                disabled={loading}
                              >
                                <Trash2 size={18} className="mr-1" />
                                <span className="text-sm">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">
                            {formatPrice(item.product.price)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity > 1 && `${formatPrice(item.product.price)} each`}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border-t border-gray-200">
                  <Link 
                    to="/products" 
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900 font-medium">{formatPrice(cart.subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax (8%)</p>
                    <p className="text-gray-900 font-medium">{formatPrice(cart.tax)}</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-gray-900 font-medium">Total</p>
                    <p className="text-gray-900 font-bold">{formatPrice(cart.total)}</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  fullWidth
                  className="flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-1" />
                </Button>
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Taxes and shipping calculated at checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;