// services/api.ts dosyası - ürün depolama sorunu düzeltildi ve yeni ürünler eklendi

import { Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderStatus, Review } from '../types';

// Local storage keys - ortak ürün deposu için tek bir anahtar 
const AUTH_USER_KEY = 'auth_user';
const CART_KEY = 'cart_items';
const WISHLIST_KEY = 'wishlist_items';
const PRODUCTS_KEY = 'shop_products'; // Global ürün deposu anahtarı

// İlk kez yüklenen örnek ürünler - Genişletilmiş ürün listesi
const initialProducts: Product[] = [
  // Elektronik Kategorisi
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with high-quality sound. Features include 30-hour battery life and comfortable over-ear design.',
    price: 199.99,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSAtYE_ZUOiBTk3wRwWs0i_Zoh07cQPI1x7UzUxGnkTlK8ACgAJutIR6Stnjw6OzADne29dJCLZfKZc6YwiW43TANj0_iQAcA3VQDeG6pix00ZbaF4leCC8DuY',
    category: 'Electronics',
    stock: 15,
    rating: 4.5,
    reviewCount: 120
  },
  // ... [previous product entries remain unchanged]
];

let dynamicProducts = [...initialProducts];

// Global ürün deposunu başlatma ve alm fonksiyonları
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

// [Previous mock users, auth helpers, and other utility functions remain unchanged]

// Updated productApi object
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

// [Previous cartApi, wishlistApi, and reviewApi implementations remain unchanged]

// Add support ticket functionality
let supportTickets: SupportTicket[] = [];

export const supportApi = {
  createTicket: async (userId: string, userName: string, subject: string, message: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTicket: SupportTicket = {
      id: (supportTickets.length + 1).toString(),
      userId,
      userName,
      subject,
      message,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    supportTickets.push(newTicket);
    return newTicket;
  },

  getTickets: async (userId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return userId ? 
      supportTickets.filter(ticket => ticket.userId === userId) : 
      supportTickets;
  },

  updateTicketStatus: async (ticketId: string, status: TicketStatus) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
};

// Update orderApi to include cancellation
export const orderApi = {
  // ... [Previous orderApi methods remain unchanged]

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

// [Previous mockCategories array remains unchanged]