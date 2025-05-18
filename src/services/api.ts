// services/api.ts
import { Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderStatus, Review, User, UserRole, SupportTicket, TicketStatus } from '../types';

// Local storage keys
const USERS_KEY = 'shop_users';
const AUTH_USER_KEY = 'auth_user';
const CART_KEY = 'cart_items';
const WISHLIST_KEY = 'wishlist_items';
const PRODUCTS_KEY = 'shop_products';
const ORDERS_KEY = 'shop_orders';

// Initialize users in localStorage if not exists
const initializeUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
};

// Mock Users for testing
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
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

initializeUsers();

// User management functions
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  register: async (name: string, email: string, password: string, role: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      role: role as UserRole
    };
    
    users.push(newUser);
    saveUsers(users);
    
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
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  // Admin functions
  getAllUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users = getUsers();
    return users.map(({ password, ...user }) => user);
  },

  deleteUser: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }
    
    saveUsers(filteredUsers);
    return { success: true };
  },

  updateUser: async (userId: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
};

// [Rest of the existing API implementations remain unchanged]