"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentButton from "@/components/paymentButton"; // Asegúrate de importar correctamente el PaymentButton

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Curso de Desarrollo Web",
      image: "/images/web-development.jpg",
      price: 29990, // Precio en CLP
      quantity: 1,
    },
    {
      id: "2",
      name: "Curso de Ciencia de Datos",
      image: "/images/data-science.jpg",
      price: 39990, // Precio en CLP
      quantity: 2,
    },
  ]);

  const [paymentData, setPaymentData] = useState<{ token: string; url: string } | null>(null);

  const totalCLP = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:3001/payment/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalCLP }),
      });
  
      const data = await response.json();
      console.log("Payment data:", data);
      setPaymentData(data); // Almacenar los datos de pago (token y url)
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };
  
  // Luego, al recibir los datos del pago, redirige a la URL correcta del backend
  if (paymentData) {
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", paymentData.url);
  
    const hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "token_ws");
    hiddenField.setAttribute("value", paymentData.token);
  
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Carrito de Compras</h1>

      {cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">Precio: ${item.price.toFixed(2)}</p>
                  <p className="text-gray-600 dark:text-gray-300">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <Button
                onClick={() => handleRemoveItem(item.id)}
                className="bg-red-500 text-white dark:bg-red-600"
              >
                Eliminar
              </Button>
            </div>
          ))}
          <div className="text-right p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Total: ${totalCLP.toFixed(2)}
            </h2>
            <Button
              onClick={handlePayment}
              className="mt-4 bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Proceder al Pago
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">Tu carrito está vacío.</p>
      )}

      {/* Mostrar el PaymentButton solo si paymentData está disponible */}
      {paymentData && (
        <PaymentButton token={paymentData.token} url={paymentData.url} />
      )}
    </div>
  );
};

export default CartPage;
