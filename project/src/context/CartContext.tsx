import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types';
import { cartApi } from '../services/api';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Varsayılan boş bir sepet oluştur
const defaultCart: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0
};

const CartContext = createContext<CartContextType>({
  cart: defaultCart,
  loading: false,
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {}
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const cartData = await cartApi.getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.addToCart(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.updateCartItem(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.removeFromCart(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const updatedCart = await cartApi.clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};