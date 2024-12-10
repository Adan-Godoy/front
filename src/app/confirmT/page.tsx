"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface PaymentDetails {
  success: boolean;
  details?: any;
  error?: string;
}

const ConfirmPage = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
 

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">
        Confirmación de Pago
      </h1>

      {paymentDetails ? (
        paymentDetails.success ? (
          <div>
            <h2 className="text-2xl font-semibold dark:text-white">
              Pago Confirmado Exitosamente
            </h2>
            <div className="mt-4">
              <h3 className="text-lg">Detalles de la Venta:</h3>
              <p><strong>Orden de Compra:</strong> {paymentDetails.details.buyOrder}</p>
              <p><strong>Fecha de Transacción:</strong> {paymentDetails.details.transactionDate}</p>
              <p><strong>Estado de la Transacción:</strong> {paymentDetails.details.status}</p>
              <p><strong>Valor Total:</strong> ${paymentDetails.details.amount}</p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-500">
              Error al Confirmar el Pago
            </h2>
            <p className="mt-4">{paymentDetails.error}</p>
          </div>
        )
      ) : (
        <p>Cargando detalles del pago...</p>
      )}
    </div>
  );
};

export default ConfirmPage;
