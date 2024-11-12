"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { gql, useMutation } from '@apollo/client';
import { signIn } from 'next-auth/react';

const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    register(createUserInput: $input) {
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

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await register({
        variables: {
          input: {
            email,
            password,
            username,
            role: "STUDENT",
          },
        },
      });

      if (data?.register?.token) {
        // Autenticación automática usando `signIn` con el token después de registrar al usuario
        await signIn("credentials", {
          token: data.register.token,
          callbackUrl: "/",
          redirect: false,
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en el registro. Inténtalo nuevamente.");
    }
  };

  const handleCheckboxChange = (checked: CheckedState) => {
    setAcceptTerms(checked === true); // Solo acepta valores booleanos
  };

  const handleGoogleSignup = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="container mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Registrarse</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <Label htmlFor="username">Nombre</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      {error && <p className="text-red-500 text-center mt-2">Error: {error.message}</p>}

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300 dark:border-gray-700" />
        <span className="px-2 text-gray-500 dark:text-gray-400">o</span>
        <hr className="flex-grow border-gray-300 dark:border-gray-700" />
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
