"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalCLP = cartItems.reduce((acc, item) => acc + item.price , 0);

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Carrito de Compras</h1>
      {cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
              <div className="flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.courseName} className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <h2 className="text-lg font-semibold">{item.courseName}</h2>
                  <p>Precio: {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(item.price)}</p>
                  <p>Cantidad: {1}</p>
                </div>
              </div>
              <Button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white">
                Eliminar
              </Button>
            </div>
          ))}
          <div className="text-right p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h2 className="text-xl font-semibold">Total: {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(totalCLP)}</h2>
            <Button onClick={clearCart} className="mt-4 bg-blue-600 text-white">
              Limpiar Carrito
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center">Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default CartPage;
