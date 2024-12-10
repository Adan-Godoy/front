"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "../api/route"; // Importa la lógica de registro

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones para registrarte.");
      setLoading(false);
      return;
    }

    try {
      const result = await register(email, password);
      if (result.success) {
        router.push("/"); // Redirige al inicio tras el registro exitoso
      } else {
        setError(result.error || "Error al registrarse.");
      }
    } catch (error) {
      setError("Hubo un error al registrarse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Registrarse</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="flex items-center">
          <input
            id="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mr-2"
          />
          <Label htmlFor="acceptTerms">
            Acepto los{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              términos y condiciones
            </a>
          </Label>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Cargando..." : "Registrarse"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
}

export default SignupPage;
