"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const totalCLP = cartItems.reduce((acc, item) => acc + item.price, 0);
  const [paymentData, setPaymentData] = useState<{ token: string; url: string } | null>(null);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v2/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalCLP,
          buyer: localStorage.getItem("userId"),
          items: cartItems.map((item) => item.id), // IDs de los cursos
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error en la transacción. Por favor, revisa los datos.");
      }
  
      const data = await response.json();
      console.log("Payment data:", data);
  
      // Mostrar datos de la transacción guardada (opcional)
      if (data.transaction) {
        console.log("Datos de la transacción guardada:", data.transaction);
      }
  
      // Redirigir a la URL de Transbank
      if (data.url && data.token) {
        // Vaciar el carrito antes de redirigir
          
        
  
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", data.url);
  
        const hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "token_ws");
        hiddenField.setAttribute("value", data.token);
  
        form.appendChild(hiddenField);
        document.body.appendChild(form);
        form.submit();
        clearCart();
      } else {
        console.error("La URL de redirección o el token no están definidos.");
      }
    } catch (error) {
      console.error("Error creando la transacción:", error);
    }
  };
  
  
  
  

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Carrito de Compras</h1>
      {cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl}
                  alt={item.courseName}
                  className="w-16 h-16 rounded-md object-cover"
                />
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
              <Button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white">
                Eliminar
              </Button>
            </div>
          ))}
          <div className="text-right p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h2 className="text-xl font-semibold">
              Total:{" "}
              {new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
              }).format(totalCLP)}
            </h2>
            <Button onClick={clearCart} className="mt-4 bg-blue-600 text-white">
              Limpiar Carrito
            </Button>
          </div>
          <Button
            onClick={handlePayment}
            className="mt-4 bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Proceder al Pago
          </Button>
        </div>
      ) : (
        <p className="text-center">Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default CartPage;
