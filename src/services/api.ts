// services/api.ts
import { Product, Cart, CartItem, Wishlist, WishlistItem, Order, OrderStatus, Review, User, UserRole } from '../types';

// Mock Users for testing
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: UserRole.BUYER
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: UserRole.SELLER
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN
  }
];

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Remove password before returning user data
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    
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
    
    // Remove password before returning user data
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('auth_user');
  },

  getCurrentUser: () => {
    const userJson = localStorage.getItem('auth_user');
    return userJson ? JSON.parse(userJson) : null;
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const updatedUser = { ...mockUsers[userIndex], ...updates };
    mockUsers[userIndex] = updatedUser;
    
    // Remove password before returning user data
    const { password: _, ...userWithoutPassword } = updatedUser;
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  }
};

// [Previous productApi implementation remains unchanged]
export const productApi = {
  // ... existing productApi implementation
};

// [Previous cartApi implementation remains unchanged]
export const cartApi = {
  // ... existing cartApi implementation
};

// [Previous wishlistApi implementation remains unchanged]
export const wishlistApi = {
  // ... existing wishlistApi implementation
};

// [Previous reviewApi implementation remains unchanged]
export const reviewApi = {
  // ... existing reviewApi implementation
};

// [Previous orderApi implementation remains unchanged]
export const orderApi = {
  // ... existing orderApi implementation
};

// [Previous supportApi implementation remains unchanged]
export const supportApi = {
  // ... existing supportApi implementation
};