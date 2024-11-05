"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import api from "../../lib/api//axios";
import useAuthStore from "@/store/authStore";
import { CheckedState } from "@radix-ui/react-checkbox";
import axios from "axios";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    try {
      const response = await api.post("/register", { name, email, password });

      if (response.status === 201) {
        const token = response.data.token;
        setToken(token); // Guarda el token en Zustand
        alert("Registro exitoso");
        router.push("/"); // Redirige a la página principal
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert("Error en el registro: " + error.response.data.message);
      } else {
        console.error("Error en el registro:", error);
      }
    }
  };

  const handleCheckboxChange = (checked: CheckedState) => {
    setAcceptTerms(checked === true); // Solo acepta valores booleanos
  };

  const handleGoogleSignup = () => {
    // Implementa la autenticación con Google aquí
    alert("Registrarse con Google - funcionalidad pendiente de implementar.");
  };

  return (
    <div className="container mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Registrarse</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>
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
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="acceptTerms" className="ml-2">
            Acepto los{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              términos y condiciones
            </a>
          </Label>
        </div>
        <div className="text-right">
          <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <Button type="submit" className="w-full">
          Registrarse
        </Button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500">o</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <Button
        onClick={handleGoogleSignup}
        className="w-full bg-red-500 hover:bg-red-600 text-white"
      >
        Registrarse con Google
      </Button>

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
