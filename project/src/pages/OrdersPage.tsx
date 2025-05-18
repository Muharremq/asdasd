import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { orderApi } from '../services/api';
import Button from '../components/ui/Button';

const OrderStatusIcon = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock className="text-yellow-500" />;
    case OrderStatus.PROCESSING:
      return <Package className="text-blue-500" />;
    case OrderStatus.SHIPPED:
      return <Truck className="text-purple-500" />;
    case OrderStatus.DELIVERED:
      return <CheckCircle className="text-green-500" />;
    case OrderStatus.CANCELLED:
      return <XCircle className="text-red-500" />;
    default:
      return null;
  }
};

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const colors = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
    [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrdersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await orderApi.getOrders(user.id);
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderApi.cancelOrder(orderId);
      // Refresh orders after cancellation
      const updatedOrders = await orderApi.getOrders(user!.id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
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
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-4">
              Looks like you haven't placed any orders yet.
            </p>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center">
                      <OrderStatusIcon status={order.status} />
                      <OrderStatusBadge status={order.status} />
                      {order.status !== OrderStatus.DELIVERED && 
                       order.status !== OrderStatus.CANCELLED && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="ml-4"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 -mx-6 px-6 py-6">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center py-4 border-b border-gray-200 last:border-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.productName}
                          </h3>
                          <p className="text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-gray-900 font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">{formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-6 bg-gray-50 rounded-md p-4">
                      <div className="flex items-center">
                        <Truck className="text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Tracking Number: {order.trackingNumber}
                          </p>
                          {order.estimatedDelivery && (
                            <p className="text-sm text-gray-500">
                              Estimated Delivery: {formatDate(order.estimatedDelivery)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;