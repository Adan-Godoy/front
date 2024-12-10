"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentDetails {
  success: boolean;
  details?: any;
  error?: string;
}

const ConfirmPage = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token_ws"); // Obtener el token_ws de la URL

    if (!token) {
      setPaymentDetails({
        success: false,
        error: "No se encontró el token de la transacción en la URL.",
      });
      setLoading(false);
      return;
    }

    const handleConfirmation = async () => {
      try {
        // Verificar el estado de la transacción con el token
        const checkResponse = await fetch(
          "http://localhost:3000/api/v2/payment/check",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const checkData = await checkResponse.json();

        if (checkData.status !== "AUTHORIZED") {
          setPaymentDetails({
            success: false,
            error: `El estado de la transacción es: ${checkData.status}.`,
          });
          setLoading(false);
          return;
        }

        // Confirmar el pago si la transacción está autorizada
        const confirmResponse = await fetch(
          "http://localhost:3000/api/v2/payment/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const confirmData = await confirmResponse.json();

        if (confirmResponse.ok) {
          setPaymentDetails({
            success: true,
            details: confirmData,
          });
        } else {
          setPaymentDetails({
            success: false,
            error: confirmData.message || "Error al confirmar el pago.",
          });
        }
      } catch (error) {
        console.error("Error al confirmar la transacción:", error);
        setPaymentDetails({
          success: false,
          error: "Error al procesar la transacción.",
        });
      } finally {
        setLoading(false);
      }
    };

    handleConfirmation();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center p-8 dark:bg-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Cargando detalles del pago...</h1>
      </div>
    );
  }

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
              <p>
                <strong>Orden de Compra:</strong>{" "}
                {paymentDetails.details.buyOrder}
              </p>
              <p>
                <strong>Fecha de Transacción:</strong>{" "}
                {paymentDetails.details.transactionDate}
              </p>
              <p>
                <strong>Estado de la Transacción:</strong>{" "}
                {paymentDetails.details.status}
              </p>
              <p>
                <strong>Valor Total:</strong> $
                {paymentDetails.details.amount}
              </p>
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
        <p>No se pudo obtener la información del pago.</p>
      )}
    </div>
  );
};

export default ConfirmPage;
