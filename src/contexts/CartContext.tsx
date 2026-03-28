import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface CartItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  name: string;
  variant_title?: string;
  sku?: string;
  price: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

export const useCart = () => useContext(CartContext);

const getCartKey = (userId: string) => `ecom_cart_${userId}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (!user?._id) return [];
    try {
      const stored = localStorage.getItem(getCartKey(user._id));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load cart when user changes
  useEffect(() => {
    if (user?._id) {
      try {
        const stored = localStorage.getItem(getCartKey(user._id));
        setCart(stored ? JSON.parse(stored) : []);
      } catch {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(getCartKey(user._id), JSON.stringify(cart));
    }
  }, [cart, user?._id]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    if (!user?._id) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.product_id === item.product_id && i.variant_id === item.variant_id
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { ...item, quantity }];
    });
    toast.success(`${item.name} added to cart`);
  }, [user?._id]);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart(prev => prev.filter(
      i => !(i.product_id === productId && i.variant_id === variantId)
    ));
    toast.info('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev => prev.map(i =>
      i.product_id === productId && i.variant_id === variantId
        ? { ...i, quantity }
        : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (user?._id) {
      localStorage.removeItem(getCartKey(user._id));
    }
  }, [user?._id]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
