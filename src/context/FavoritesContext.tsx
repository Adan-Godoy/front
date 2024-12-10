import React, { createContext, useContext, useEffect, useState } from "react";

interface FavoriteItem {
  id: string;
  courseName: string;
  imageUrl: string;
  price: number;
}

interface FavoritesContextProps {
  favoriteItems: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.error("Error al cargar los favoritos desde localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favoriteItems));
    } catch (error) {
      console.error("Error al guardar los favoritos en localStorage:", error);
    }
  }, [favoriteItems]);

  const addToFavorites = (item: FavoriteItem) => {
    setFavoriteItems((prevFavorites) => {
      if (!prevFavorites.find((favoriteItem) => favoriteItem.id === item.id)) {
        return [...prevFavorites, item];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavoriteItems((prevFavorites) => prevFavorites.filter((item) => item.id !== id));
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteItems, addToFavorites, removeFromFavorites, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites debe ser usado dentro de un FavoritesProvider");
  }
  return context;
};
