import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";

interface FavouritesContextType {
  favourites: Product[];
  toggleFavourite: (product: Product) => void;
  isFavourite: (id: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("diary-favourites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("diary-favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (product: Product) => {
    setFavourites(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isFavourite = (id: string) => favourites.some(p => p.id === id);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
};
