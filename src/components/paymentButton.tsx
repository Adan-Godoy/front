"use client";
import React, { useRef } from "react";

interface PaymentButtonProps {
  token: string;
  url: string;
}
function PaymentButton({ token, url }: PaymentButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handlePayment = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <>
      <form
        ref={formRef}
        method="POST"
        action={url}
        style={{ display: "none" }}
      >
        <input type="hidden" name="token_ws" value={token} />
      </form>
      <button onClick={handlePayment}>Pagar con Webpay</button>
    </>
  );
}

export default PaymentButton;