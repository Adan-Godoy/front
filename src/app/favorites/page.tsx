"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type FavoriteItem = {
  id: string;
  name: string;
  image: string;
  instructor: string;
};

function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: "1",
      name: "Curso de Desarrollo Web",
      image: "/images/web-development.jpg",
      instructor: "Juan Pérez",
    },
    {
      id: "2",
      name: "Curso de Ciencia de Datos",
      image: "/images/data-science.jpg",
      instructor: "Ana Gómez",
    },
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Mis Favoritos</h1>

      {favorites.length > 0 ? (
        <div className="space-y-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">Instructor: {item.instructor}</p>
                </div>
              </div>
              <Button
                onClick={() => handleRemoveFavorite(item.id)}
                className="bg-red-500 text-white dark:bg-red-600"
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">No tienes cursos favoritos.</p>
      )}
    </div>
  );
}

export default FavoritesPage;
