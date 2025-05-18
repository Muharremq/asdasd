// services/api.ts dosyası - ürün depolama sorunu düzeltildi ve yeni ürünler eklendi

import { Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderStatus, Review, User, UserRole, SupportTicket, TicketStatus } from '../types';

// Local storage keys - ortak ürün deposu için tek bir anahtar 
const AUTH_USER_KEY = 'auth_user';
const CART_KEY = 'cart_items';
const WISHLIST_KEY = 'wishlist_items';
const PRODUCTS_KEY = 'shop_products'; // Global ürün deposu anahtarı
const ORDERS_KEY = 'shop_orders'; // Siparişler için anahtar

// Mock kullanıcılar
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // Gerçek uygulamada hash'lenirdi
    role: UserRole.BUYER,
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: UserRole.SELLER,
    phone: '+9876543210'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN
  }
];

// İlk kez yüklenen örnek ürünler - Genişletilmiş ürün listesi
const initialProducts: Product[] = [
  // Elektronik Kategorisi
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with high-quality sound. Features include 30-hour battery life and comfortable over-ear design.',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 15,
    sellerId: '2',
    rating: 4.5,
    reviewCount: 120
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and smartphone notifications.',
    price: 149.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 25,
    sellerId: '2',
    rating: 4.2,
    reviewCount: 85
  },
  {
    id: '3',
    name: '4K Ultra HD Smart TV - 55"',
    description: 'Crystal clear 4K resolution, smart features, and HDR support for the ultimate viewing experience.',
    price: 699.99,
    image: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Electronics',
    stock: 10,
    sellerId: '2',
    rating: 4.7,
    reviewCount: 65
  }
];

// Dinamik ürün listesi
let dynamicProducts = [...initialProducts];

// Global ürün deposunu başlatma ve alma fonksiyonları
const initializeProducts = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
};

initializeProducts();

const getProducts = (): Product[] => {
  const productsJson = localStorage.getItem(PRODUCTS_KEY);
  if (productsJson) {
    return JSON.parse(productsJson);
  }
  return [];
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Sipariş yardımcı fonksiyonları
const loadOrders = (): Order[] => {
  const ordersJson = localStorage.getItem(ORDERS_KEY);
  if (ordersJson) {
    return JSON.parse(ordersJson);
  }
  return [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // API gecikmesi simülasyonu
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Şifreyi kullanıcı verisinden silerek döndür
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  register: async (name: string, email: string, password: string, role: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      password,
      role: role as UserRole
    };
    
    mockUsers.push(newUser);
    
    // Şifreyi kullanıcı verisinden silerek döndür
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem(AUTH_USER_KEY);
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const updatedUser = { ...mockUsers[userIndex], ...updates };
    mockUsers[userIndex] = updatedUser;
    
    // Şifreyi kullanıcı verisinden silerek döndür
    const { password: _, ...userWithoutPassword } = updatedUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }
};

// Product API
export const productApi = {
  getProducts: async (filters?: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredProducts = [...dynamicProducts];
    
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= filters.minPrice
        );
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= filters.maxPrice
        );
      }
      
      if (filters.sortBy) {
        filteredProducts.sort((a, b) => {
          if (filters.sortBy === 'price') {
            return filters.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
          } else if (filters.sortBy === 'rating') {
            return filters.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
          } else if (filters.sortBy === 'newest') {
            return filters.sortOrder === 'desc' ? 
              parseInt(b.id) - parseInt(a.id) : 
              parseInt(a.id) - parseInt(b.id);
          }
          return 0;
        });
      }
    }
    
    return filteredProducts;
  },

  getProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const product = dynamicProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  addProduct: async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProduct: Product = {
      ...productData,
      id: (dynamicProducts.length + 1).toString(),
      rating: 0,
      reviewCount: 0
    };
    
    dynamicProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = dynamicProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    dynamicProducts[index] = { ...dynamicProducts[index], ...updates };
    return dynamicProducts[index];
  },

  deleteProduct: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const initialLength = dynamicProducts.length;
    dynamicProducts = dynamicProducts.filter(p => p.id !== id);
    
    if (dynamicProducts.length === initialLength) {
      throw new Error('Product not found');
    }
    
    return { success: true };
  }
};

// Cart API
export const cartApi = {
  getCart: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const cartItems: CartItem[] = [];
    let subtotal = 0;
    
    // Demo amaçlı basit bir sepet oluştur
    const product = dynamicProducts[0];
    if (product) {
      const cartItem: CartItem = {
        productId: product.id,
        product,
        quantity: 1
      };
      cartItems.push(cartItem);
      subtotal += product.price;
    }
    
    const tax = subtotal * 0.08; // %8 vergi
    const total = subtotal + tax;
    
    return {
      items: cartItems,
      subtotal,
      tax,
      total
    };
  },

  addToCart: async (productId: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    if (product.stock < quantity) {
      throw new Error('Not enough stock');
    }
    
    // Gerçek bir uygulamada, bu bir veritabanı veya local storage'ı güncellerdi
    return {
      items: [
        {
          productId,
          product,
          quantity
        }
      ],
      subtotal: product.price * quantity,
      tax: product.price * quantity * 0.08,
      total: product.price * quantity * 1.08
    };
  },

  updateCartItem: async (productId: string, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    if (product.stock < quantity) {
      throw new Error('Not enough stock');
    }
    
    return {
      items: [
        {
          productId,
          product,
          quantity
        }
      ],
      subtotal: product.price * quantity,
      tax: product.price * quantity * 0.08,
      total: product.price * quantity * 1.08
    };
  },

  removeFromCart: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
  },

  clearCart: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };
  }
};

// Wishlist API
export const wishlistApi = {
  getWishlist: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const wishlistItems: WishlistItem[] = [];
    
    // Demo amaçlı örnek bir istek listesi öğesi ekle
    const product = dynamicProducts[1];
    if (product) {
      const wishlistItem: WishlistItem = {
        id: '1',
        userId: '1',
        productId: product.id,
        product,
        addedAt: new Date().toISOString()
      };
      wishlistItems.push(wishlistItem);
    }
    
    return {
      items: wishlistItems
    };
  },

  addToWishlist: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    const wishlistItem: WishlistItem = {
      id: Math.random().toString(),
      userId: '1', // Demo için sabit bir kullanıcı ID'si kullanılıyor
      productId,
      product,
      addedAt: new Date().toISOString()
    };
    
    return {
      items: [wishlistItem]
    };
  },

  removeFromWishlist: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      items: []
    };
  }
};

// Review API
export const reviewApi = {
  getProductReviews: async (productId: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Örnek değerlendirmeler oluştur
    return [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        productId,
        rating: 5,
        comment: 'Excellent product! Exceeded my expectations.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 gün önce
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        productId,
        rating: 4,
        comment: 'Very good quality, but shipping took longer than expected.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 gün önce
      }
    ];
  },

  createReview: async (productId: string, userId: string, userName: string, rating: number, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const product = dynamicProducts.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    // Gerçek bir uygulamada, bu bir veritabanını güncellerdi
    // ve ürünün puanını yeniden hesaplardı
    return {
      id: Math.random().toString(),
      userId,
      userName,
      productId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
  }
};

// Order API
export const orderApi = {
  getOrders: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Örnek siparişler oluştur
    return [
      {
        id: '1',
        userId,
        items: [
          {
            productId: '1',
            productName: 'Wireless Headphones',
            price: 199.99,
            quantity: 1,
            image: dynamicProducts[0].image
          }
        ],
        status: OrderStatus.DELIVERED,
        subtotal: 199.99,
        tax: 16.00,
        total: 215.99,
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'credit_card',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün önce
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 gün önce (çoktan teslim edilmiş)
      },
      {
        id: '2',
        userId,
        items: [
          {
            productId: '2',
            productName: 'Smart Fitness Watch',
            price: 149.99,
            quantity: 1,
            image: dynamicProducts[1].image
          }
        ],
        status: OrderStatus.SHIPPED,
        subtotal: 149.99,
        tax: 12.00,
        total: 161.99,
        shippingAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'paypal',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün önce
        trackingNumber: 'TRK987654321',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 gün sonra
      }
    ];
  },

  cancelOrder: async (orderId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) throw new Error('Order not found');
    if (orders[orderIndex].status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel delivered order');
    }
    
    orders[orderIndex].status = OrderStatus.CANCELLED;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    saveOrders(orders);
    return orders[orderIndex];
  }
};

// Support Ticket API
export const supportApi = {
  createTicket: async (userId: string, userName: string, subject: string, message: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTicket: SupportTicket = {
      id: Math.random().toString(),
      userId,
      userName,
      subject,
      message,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newTicket;
  },

  getTickets: async (userId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Örnek destek talepleri oluştur
    const tickets: SupportTicket[] = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        subject: 'Order Delivery Issue',
        message: 'My order #1 was supposed to arrive yesterday but I still haven\'t received it.',
        status: TicketStatus.OPEN,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 gün önce
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        subject: 'Refund Request',
        message: 'I would like to request a refund for my recent purchase as the item was damaged.',
        status: TicketStatus.IN_PROGRESS,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 gün önce
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 gün önce
      }
    ];
    
    if (userId) {
      return tickets.filter(ticket => ticket.userId === userId);
    }
    return tickets;
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      id: ticketId,
      status,
      updatedAt: new Date().toISOString()
    };
  }
};

// Kategoriler
export const mockCategories = [
  'Electronics',
  'Books',
  'Fashion',
  'Shoes',
  'Home & Kitchen',
  'Sports',
  'Health & Beauty'
];