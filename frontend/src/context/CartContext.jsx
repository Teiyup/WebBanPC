import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { cartService } from '../services/services';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'cart_items';

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize cart on mount and when user changes
  useEffect(() => {
    initCart();
  }, [user?.id]);

  const initCart = async () => {
    try {
      setLoading(true);

      // Load from localStorage first
      const localCart = localStorage.getItem(CART_STORAGE_KEY);
      const localItems = localCart ? JSON.parse(localCart) : [];

      if (user) {
        // User logged in - sync with database
        try {
          const response = await cartService.getCart();
          const dbItems = response.data.data?.items || [];

          // Merge: add items from localStorage that don't exist in DB
          for (const localItem of localItems) {
            const existsInDb = dbItems.some(
              dbItem =>
                dbItem.product?._id === localItem.product._id ||
                dbItem.productId === localItem.product._id
            );

            if (!existsInDb) {
              await cartService.addToCart({
                productId: localItem.product._id,
                quantity: localItem.quantity,
              });
            }
          }

          // Fetch final cart from DB
          const finalResponse = await cartService.getCart();
          const finalItems = finalResponse.data.data?.items || [];

          const formatted = finalItems.map(item => ({
            product: {
              _id: item.product?._id || item.productId,
              name: item.productName,
              price: item.price,
              image: item.productImage,
            },
            quantity: item.quantity,
          }));

          setCart(formatted);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(formatted));
        } catch (error) {
          console.error('Error syncing with database:', error);
          setCart(localItems);
        }
      } else {
        // Guest - use localStorage only
        setCart(localItems);
      }
    } catch (error) {
      console.error('Error initializing cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product._id === product._id);
      let newCart;

      if (existingItem) {
        newCart = prevCart.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { product, quantity }];
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));

      if (user) {
        cartService
          .addToCart({ productId: product._id, quantity })
          .catch(error => console.error('Error adding to DB:', error));
      }

      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.product._id !== productId);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));

      if (user) {
        cartService
          .removeFromCart(productId)
          .catch(error => console.error('Error removing from DB:', error));
      }

      return newCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      );

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));

      if (user) {
        cartService
          .updateQuantity(productId, { quantity: newQuantity })
          .catch(error => console.error('Error updating DB:', error));
      }

      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);

    if (user) {
      cartService
        .clearCart()
        .catch(error => console.error('Error clearing DB:', error));
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
