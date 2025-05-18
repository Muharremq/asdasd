import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Truck, ArrowLeft, Share2 } from 'lucide-react';
import { Product, Review } from '../types';
import { productApi, reviewApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  
  // New review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const productData = await productApi.getProduct(id);
        setProduct(productData);
        
        const reviewsData = await reviewApi.getProductReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndReviews();
  }, [id]);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !user) return;
    
    try {
      setSubmittingReview(true);
      const newReview = await reviewApi.createReview(
        product.id,
        user.id,
        user.name,
        reviewRating,
        reviewComment
      );
      
      setReviews(prev => [newReview, ...prev]);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 w-1/4 mb-4 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 w-3/4 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/4 rounded"></div>
              <div className="h-4 bg-gray-300 w-full rounded"></div>
              <div className="h-4 bg-gray-300 w-full rounded"></div>
              <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
              <div className="h-10 bg-gray-300 w-full rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/products" className="flex items-center hover:text-blue-600">
            <ArrowLeft size={16} className="mr-1" />
            Back to Products
          </Link>
        </nav>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg object-cover"
            />
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <Share2 size={20} className="text-gray-700" />
            </button>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            <p className="text-2xl font-bold text-gray-900 mb-6">
              {formatPrice(product.price)}
            </p>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Category</h3>
              <div className="bg-gray-100 text-gray-800 inline-block px-3 py-1 rounded-full text-sm">
                {product.category}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Availability</h3>
              <p className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </p>
            </div>
            
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="w-full sm:w-1/3">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2 w-full sm:w-2/3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleAddToCart}
                    isLoading={cartLoading}
                    className="flex items-center justify-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                  >
                    <Heart size={18} />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Truck size={18} className="mr-2 text-green-600" />
                Free shipping on orders over $50
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'description'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 text-sm font-medium border-b-2 flex items-center ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
              <span className="ml-2 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                {reviews.length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="pb-16">
          {activeTab === 'description' ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
                Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl, nec aliquet nisl
                nisl nec aliquet nisl. Sed euismod, nisl nec ultricies lacinia, nisl nisl aliquet nisl.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
              
              {/* Review Form */}
              {user ? (
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewRating(rating)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={`${
                                rating <= reviewRating ? 'text-amber-500' : 'text-gray-300'
                              }`}
                              fill={
                                rating <= reviewRating ? 'currentColor' : 'none'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      isLoading={submittingReview}
                      disabled={reviewComment.trim() === ''}
                    >
                      Submit Review
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg mb-8 text-center">
                  <p className="text-blue-700 mb-2">
                    Want to leave a review?
                  </p>
                  <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800">
                    Log in to write a review
                  </Link>
                </div>
              )}
              
              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center mb-2">
                        <div className="font-medium text-gray-900 mr-2">
                          {review.userName}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-amber-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={i < review.rating ? "" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;