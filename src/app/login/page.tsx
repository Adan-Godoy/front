"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "../api/route"; // Importa la lógica de login

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success ) {
        // Redireccionar al inicio después del login exitoso
        window.location.href = "/";
      } else {
        setError("Contraseña y/o correo electrónico incorrecto.");
      }
    } catch (error: any) {
      // Capturar el error y manejarlo de forma amigable
      if (error.response && error.response.status === 401) {
        setError("Contraseña y/o correo electrónico incorrecto.");
      } else {
        setError("Hubo un error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto max-w-md p-8 bg-white dark:bg-gray-900 dark:text-gray-200 shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Iniciar Sesión</h1>

      {error && <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
            placeholder="ejemplo@correo.com"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
            placeholder="********"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
        ¿No tienes cuenta?{" "}
        <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
