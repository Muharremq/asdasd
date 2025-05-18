import { Product, Review, User, UserRole, SupportTicket, TicketStatus, Order, OrderStatus } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.BUYER,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: UserRole.SELLER,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@shopease.com',
    role: UserRole.ADMIN,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  // Electronics
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 50,
    sellerId: '2',
    rating: 4.8,
    reviewCount: 245
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and smartphone notifications.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 75,
    sellerId: '2',
    rating: 4.6,
    reviewCount: 189
  },
  {
    id: '3',
    name: '4K Ultra HD Smart TV - 55"',
    description: 'Crystal clear 4K resolution, smart features, and HDR support for the ultimate viewing experience.',
    price: 699.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 20,
    sellerId: '2',
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: '4',
    name: 'Professional Gaming Laptop',
    description: 'High-performance gaming laptop with RTX graphics, 16GB RAM, and 1TB SSD storage.',
    price: 1499.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 15,
    sellerId: '2',
    rating: 4.9,
    reviewCount: 92
  },
  
  // Books
  {
    id: '5',
    name: 'The Art of Programming',
    description: 'Comprehensive guide to modern programming practices and principles.',
    price: 49.99,
    category: 'Books',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 100,
    sellerId: '2',
    rating: 4.5,
    reviewCount: 78
  },
  {
    id: '6',
    name: 'Business Strategy Guide',
    description: 'Essential reading for entrepreneurs and business leaders.',
    price: 34.99,
    category: 'Books',
    image: 'https://images.pexels.com/photos/1005324/literature-book-open-pages-1005324.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 85,
    sellerId: '2',
    rating: 4.3,
    reviewCount: 45
  },
  
  // Fashion
  {
    id: '7',
    name: 'Classic Leather Jacket',
    description: 'Timeless leather jacket with premium quality materials and comfortable fit.',
    price: 199.99,
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 30,
    sellerId: '2',
    rating: 4.7,
    reviewCount: 134
  },
  {
    id: '8',
    name: 'Designer Sunglasses',
    description: 'Stylish sunglasses with UV protection and polarized lenses.',
    price: 129.99,
    category: 'Fashion',
    image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 45,
    sellerId: '2',
    rating: 4.4,
    reviewCount: 89
  },
  
  // Shoes
  {
    id: '9',
    name: 'Running Performance Shoes',
    description: 'Lightweight and comfortable running shoes with advanced cushioning technology.',
    price: 129.99,
    category: 'Shoes',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 60,
    sellerId: '2',
    rating: 4.8,
    reviewCount: 167
  },
  {
    id: '10',
    name: 'Classic Leather Boots',
    description: 'Durable leather boots perfect for any occasion.',
    price: 159.99,
    category: 'Shoes',
    image: 'https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 40,
    sellerId: '2',
    rating: 4.6,
    reviewCount: 112
  },
  
  // Home & Kitchen
  {
    id: '11',
    name: 'Smart Coffee Maker',
    description: 'Programmable coffee maker with smartphone control and multiple brewing options.',
    price: 149.99,
    category: 'Home & Kitchen',
    image: 'https://images.pexels.com/photos/3020919/pexels-photo-3020919.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 35,
    sellerId: '2',
    rating: 4.5,
    reviewCount: 98
  },
  {
    id: '12',
    name: 'Air Fryer Pro',
    description: 'Large capacity air fryer with digital controls and multiple cooking presets.',
    price: 129.99,
    category: 'Home & Kitchen',
    image: 'https://images.pexels.com/photos/4109996/pexels-photo-4109996.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 25,
    sellerId: '2',
    rating: 4.7,
    reviewCount: 156
  },
  
  // Sports & Outdoors
  {
    id: '13',
    name: 'Professional Yoga Mat',
    description: 'Extra thick yoga mat with carrying strap and non-slip surface.',
    price: 39.99,
    category: 'Sports',
    image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 100,
    sellerId: '2',
    rating: 4.4,
    reviewCount: 89
  },
  {
    id: '14',
    name: 'Mountain Bike',
    description: '21-speed mountain bike with front suspension and disc brakes.',
    price: 499.99,
    category: 'Sports',
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 15,
    sellerId: '2',
    rating: 4.8,
    reviewCount: 67
  },
  
  // Beauty & Personal Care
  {
    id: '15',
    name: 'Professional Hair Dryer',
    description: 'Salon-quality hair dryer with ionic technology and multiple heat settings.',
    price: 89.99,
    category: 'Health & Beauty',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 50,
    sellerId: '2',
    rating: 4.6,
    reviewCount: 123
  },
  {
    id: '16',
    name: 'Skincare Gift Set',
    description: 'Luxury skincare set including cleanser, toner, and moisturizer.',
    price: 79.99,
    category: 'Health & Beauty',
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 40,
    sellerId: '2',
    rating: 4.5,
    reviewCount: 91
  }
];

// Mock Categories
export const mockCategories = [
  'Electronics',
  'Books',
  'Fashion',
  'Shoes',
  'Home & Kitchen',
  'Sports',
  'Health & Beauty'
];

// Rest of the mock data remains unchanged
export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    productId: '1',
    rating: 5,
    comment: 'These headphones are amazing! Great sound quality and the battery lasts for days.',
    createdAt: '2023-09-15T14:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    productId: '2',
    rating: 4,
    comment: 'Good watch, but the battery life could be better.',
    createdAt: '2023-08-22T10:15:00Z'
  },
  {
    id: '3',
    userId: '1',
    userName: 'John Doe',
    productId: '3',
    rating: 5,
    comment: 'Makes perfect coffee every time! Very happy with my purchase.',
    createdAt: '2023-10-01T08:45:00Z'
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    subject: 'Order Delivery Issue',
    message: 'My order #12345 was supposed to be delivered yesterday but I still haven\'t received it.',
    status: TicketStatus.OPEN,
    createdAt: '2023-10-05T09:20:00Z',
    updatedAt: '2023-10-05T09:20:00Z'
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Doe',
    subject: 'Return Request',
    message: 'I would like to return the headphones I purchased as they are faulty.',
    status: TicketStatus.IN_PROGRESS,
    createdAt: '2023-09-28T14:10:00Z',
    updatedAt: '2023-09-29T11:30:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [
      {
        productId: '1',
        productName: 'Wireless Headphones',
        price: 199.99,
        quantity: 1
      },
      {
        productId: '5',
        productName: 'Laptop Backpack',
        price: 49.99,
        quantity: 1
      }
    ],
    status: OrderStatus.DELIVERED,
    subtotal: 249.98,
    tax: 20,
    total: 269.98,
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    createdAt: '2023-09-10T15:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    items: [
      {
        productId: '3',
        productName: 'Coffee Maker',
        price: 99.99,
        quantity: 1
      }
    ],
    status: OrderStatus.SHIPPED,
    subtotal: 99.99,
    tax: 8,
    total: 107.99,
    shippingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    createdAt: '2023-10-02T11:45:00Z'
  }
];

// Mock Statistics
export const mockStatistics = {
  totalSales: 25789.45,
  totalOrders: 342,
  newCustomers: 87,
  pendingDeliveries: 28,
  monthlyRevenue: [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 2500 },
    { month: 'Apr', revenue: 2200 },
    { month: 'May', revenue: 2700 },
    { month: 'Jun', revenue: 3100 },
    { month: 'Jul', revenue: 3500 },
    { month: 'Aug', revenue: 3200 },
    { month: 'Sep', revenue: 3800 },
    { month: 'Oct', revenue: 3500 },
    { month: 'Nov', revenue: 4200 },
    { month: 'Dec', revenue: 4800 }
  ]
};