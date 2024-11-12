"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";
import { gql, useQuery } from '@apollo/client';

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      id
      username
      email
      role
      createdAt
    }
  }
`;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ejecutar la consulta de perfil de usuario solo si la sesión está presente
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    skip: !session?.accessToken,
  });

  // Redireccionar si el usuario no está autenticado
  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated" && mounted) {
      router.push("/login");
    }
  }, [status, mounted, router]);

  const handleLogout = () => {
    signOut();
    setTheme("light"); // Cambia el tema a claro al cerrar sesión
    router.push("/");
  };

  if (!mounted || loading || status === "loading") return <p>Cargando...</p>;

  if (error || !data) return <p>Error: No se pudo cargar el perfil del usuario.</p>;

  const { username, email, role, createdAt } = data.getUserProfile;

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Perfil de Usuario</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Columna izquierda: Información Personal */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 space-y-6">
          <h2 className="text-xl font-semibold dark:text-gray-100">Información Personal</h2>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Detalles del Usuario</h3>
            <p className="dark:text-gray-300"><strong>Nombre:</strong> {username}</p>
            <p className="dark:text-gray-300"><strong>Email:</strong> {email}</p>
            <p className="dark:text-gray-300"><strong>Rol:</strong> {role}</p>
            <p className="dark:text-gray-300"><strong>Creado:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            <Link href="/profile/edit" legacyBehavior>
              <Button variant="outline" className="mt-4 dark:border-gray-600 dark:text-gray-300">Editar Información</Button>
            </Link>
          </div>

          {/* Historial de Compras */}
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Historial de Compras</h3>
            <p className="text-gray-700 dark:text-gray-300">Aquí puedes ver todas las compras que has realizado.</p>
            <Link href="/profile/orders" legacyBehavior>
              <Button variant="outline" className="mt-4 dark:border-gray-600 dark:text-gray-300">Ver Historial</Button>
            </Link>
          </div>

          {/* Cerrar Sesión */}
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Cerrar Sesión</h3>
            <p className="text-gray-700 dark:text-gray-300">¿Deseas cerrar tu sesión?</p>
            <Button onClick={handleLogout} className="mt-4 bg-red-500 text-white dark:bg-red-600">
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Columna derecha: Opciones adicionales */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 flex flex-col items-center space-y-6">
          <h2 className="text-xl font-semibold dark:text-gray-100">Opciones de Tema</h2>
          <ThemeToggle />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">¿Quieres ser Instructor?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Si tienes conocimientos que deseas compartir, únete a nuestra plataforma como instructor y enseña a otros.
            </p>
            <Link href="/profile/become-instructor" legacyBehavior>
              <Button variant="outline" className="mt-4 dark:border-gray-600 dark:text-gray-300">Quiero ser Instructor</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
