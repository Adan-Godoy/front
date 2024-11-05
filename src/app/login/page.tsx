"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../lib/api/axios";
import useAuthStore from "@/store/authStore";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { email, password });

      if (response.status === 200) {
        const token = response.data.token;
        setToken(token); // Guarda el token en Zustand
        alert("Inicio de sesión exitoso");
        router.push("/"); // Redirige a la página principal
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert("Error de autenticación: " + error.response.data.message);
      } else {
        console.error("Error en el inicio de sesión:", error);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Implementa la autenticación con Google aquí
    alert("Iniciar sesión con Google - funcionalidad pendiente de implementar.");
  };

  return (
    <div className="container mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="space-y-4">
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
        <div className="text-right">
          <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500">o</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 hover:bg-red-600 text-white"
      >
        Iniciar sesión con Google
      </Button>

      <p className="text-center mt-4 text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}

export default LoginPage;
