import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const currentUser = 1; 

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`http://localhost:3009/api/cart/${currentUser}`);
      const data = await response.json();
      setCartCount(data.totals?.total_items || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);