import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, ProductColor } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (productId: string, size: string, colorName: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PROMO_CODES: Record<string, number> = {
  "DIARY10": 10,
  "DIARY20": 20,
  "NEWCLIENT": 15,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("diary-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem("diary-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setItems(prev => 
      prev.filter(
        item => 
          !(item.product.id === productId && 
            item.selectedSize === size && 
            item.selectedColor.name === colorName)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, colorName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor.name === colorName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode("");
    setDiscount(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (PROMO_CODES[upperCode]) {
      setPromoCode(upperCode);
      setDiscount(PROMO_CODES[upperCode]);
      return true;
    }
    return false;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalPrice = subtotal - (subtotal * discount / 100);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        promoCode,
        applyPromoCode,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
