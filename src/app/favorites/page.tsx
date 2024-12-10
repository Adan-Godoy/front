"use client";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const FavoritesPage = () => {
  const { favoriteItems, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const moveToCart = (item: any) => {
    addToCart(item);
    removeFromFavorites(item.id);
  };

  const moveAllToCart = () => {
    favoriteItems.forEach((item) => addToCart(item));
    clearFavorites();
  };

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Mis Favoritos</h1>
      {favoriteItems.length > 0 ? (
        <>
          <div className="space-y-6">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.courseName} className="w-16 h-16 rounded-md object-cover" />
                  <div>
                    <h2 className="text-lg font-semibold">{item.courseName}</h2>
                    <p>
                      Precio:{" "}
                      {new Intl.NumberFormat("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      }).format(item.price)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => moveToCart(item)}
                    className="bg-blue-500 text-white"
                  >
                    Mover al Carrito
                  </Button>
                  <Button
                    onClick={() => removeFromFavorites(item.id)}
                    className="bg-red-500 text-white"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={moveAllToCart} className="mt-6 bg-green-500 text-white">
            Mover Todos al Carrito
          </Button>
        </>
      ) : (
        <p className="text-center">No tienes cursos en favoritos.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
