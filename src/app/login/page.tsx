"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gql, useMutation } from '@apollo/client';
import { signIn, useSession } from 'next-auth/react';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user {
        id
        username
        email
        role
        createdAt
        updatedAt
      }
    }
  }
`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session, status } = useSession(); // Utilizar session de next-auth
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
  
    try {
      const result = await signIn("credentials", {
        email,           // Agrega aquí el email
        password,        // Agrega aquí el password
        redirect: false, // Evita la redirección automática para manejar errores
      });
  
      if (result?.error) {
        setError("Error en el inicio de sesión, por favor intente nuevamente.");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Error en el inicio de sesión, por favor intente nuevamente.");
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
        <div className="text-right">
          <a href="/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <Button type="submit" disabled={loading} className="w-full dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Button>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        <span className="px-2 text-gray-500 dark:text-gray-400">o</span>
        <hr className="flex-grow border-gray-300 dark:border-gray-700" />
      </div>

      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
      >
        Iniciar sesión con Google
      </Button>

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
