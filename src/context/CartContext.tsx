import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string;
  courseName: string;
  imageUrl: string;
  price: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevCart) => {
      if (!prevCart.find((cartItem) => cartItem.id === item.id)) {
        return [...prevCart, item];
      }
      return prevCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
