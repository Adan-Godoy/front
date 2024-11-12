// src/app/auth/error/page.tsx
"use client";

import { useRouter } from "next/navigation"; // Cambia a next/navigation

export default function AuthErrorPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Error de autenticación</h1>
      <p>Hubo un problema con la autenticación. Por favor, intenta nuevamente.</p>
      <button onClick={() => router.push("/")}>Volver al inicio</button>
    </div>
  );
}
