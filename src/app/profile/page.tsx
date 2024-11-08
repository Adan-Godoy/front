"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const { setTheme } = useTheme();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Asegurarse de que el componente está montado en el cliente
  }, []);

  // Redirigir al usuario si no está autenticado, después de montar
  useEffect(() => {
    if (!token && mounted) {
      router.push("/login");
    }
  }, [token, router, mounted]);

  const handleLogout = () => {
    logout();
    setTheme("light"); // Cambiar el tema a claro al cerrar sesión
    router.push("/");
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  // Si el componente no está montado, no renderiza nada
  if (!mounted) return null;

  return (
    (<div className="container mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Perfil de Usuario</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna izquierda: Opciones de perfil */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold dark:text-gray-100">Opciones de Perfil</h2>

          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Información Personal</h3>
            <p className="dark:text-gray-300"><strong>Nombre:</strong> Juan Pérez</p>
            <p className="dark:text-gray-300"><strong>Email:</strong> juan.perez@example.com</p>
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

          {/* ¿Quieres ser Instructor? */}
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">¿Quieres ser Instructor?</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Si tienes conocimientos que deseas compartir, únete a nuestra plataforma como instructor y enseña a otros.
            </p>
            <Link href="/profile/become-instructor" legacyBehavior>
              <Button variant="outline" className="mt-4 dark:border-gray-600 dark:text-gray-300">Quiero ser Instructor</Button>
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

        {/* Columna derecha: Foto de perfil y opción de tema */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 flex flex-col items-center space-y-6">
          {/* Foto de Perfil */}
          <h2 className="text-xl font-semibold dark:text-gray-100">Foto de Perfil</h2>
          <div className="w-32 h-32 mb-4">
            <img
              src={profilePic || "/default-profile.png"}
              alt="Foto de perfil"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="text-sm dark:text-gray-300"
          />

          {/* Cambiar Tema */}
          <h2 className="text-xl font-semibold dark:text-gray-100">Cambiar Tema</h2>
          <ThemeToggle />
        </div>
      </div>
    </div>)
  );
}

