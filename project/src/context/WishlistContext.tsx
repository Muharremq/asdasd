import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Wishlist, WishlistItem } from '../types';
import { wishlistApi } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist;
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

// Varsayılan boş bir istek listesi oluştur
const defaultWishlist: Wishlist = {
  items: []
};

const WishlistContext = createContext<WishlistContextType>({
  wishlist: defaultWishlist,
  loading: false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false
});

export const useWishlist = () => useContext(WishlistContext);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist>(defaultWishlist);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!isAuthenticated) {
        setWishlist(defaultWishlist);
        return;
      }

      try {
        setLoading(true);
        const wishlistData = await wishlistApi.getWishlist();
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [isAuthenticated]);

  const addToWishlist = async (productId: string) => {
    try {
      setLoading(true);
      const updatedWishlist = await wishlistApi.addToWishlist(productId);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setLoading(true);
      const updatedWishlist = await wishlistApi.removeFromWishlist(productId);
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist?.items?.some(item => item.productId === productId) || false;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};