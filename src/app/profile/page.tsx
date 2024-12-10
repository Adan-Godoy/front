"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "../api/route";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";

interface User {
  fullName: string;
  username: string;
  email: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Estado para editar
  const [editedUser, setEditedUser] = useState<User | null>(null); // Usuario editado
  const { setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        window.location.href = "/login"; // Redirigir si no hay usuario logueado
        return;
      }

      try {
        const response = await axios.get(`/user/${userId}`);
        console.log(response.data);
        setUser(response.data);
        setEditedUser(response.data); // Inicializar con los datos actuales del usuario
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        localStorage.clear(); // Limpiar localStorage en caso de error
        window.location.href = "/login";
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setTheme("light");
    window.location.href = "/login";
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Alternar entre el modo de edición y visualización
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !editedUser) return;

    try {
      await axios.put(`/user/${userId}`, editedUser);
      setUser(editedUser); // Actualizar el usuario con los datos guardados
      setIsEditing(false); // Salir del modo de edición
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Perfil de Usuario</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda: Información Personal */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded p-6 space-y-6">
          <h2 className="text-xl font-semibold dark:text-gray-100">Información Personal</h2>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="dark:text-gray-300 block">Nombre:</label>
                <input
                  type="text"
                  name="fullName"
                  value={editedUser?.fullName || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="dark:text-gray-300 block">Usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={editedUser?.username || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="dark:text-gray-300 block">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedUser?.email || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
                  disabled
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button onClick={handleEditToggle} className="bg-gray-500 text-white">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-green-500 text-white">
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="dark:text-gray-300">
                <strong>Nombre:</strong> {user?.fullName || "N/A"}
              </p>
              <p className="dark:text-gray-300">
                <strong>Usuario:</strong> {user?.username || "N/A"}
              </p>
              <p className="dark:text-gray-300">
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <Button onClick={handleEditToggle} className="mt-4 bg-blue-500 text-white">
                Editar Información
              </Button>
            </div>
          )}

          

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

          {/* Historial de Compras */}
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Historial de Compras</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Aquí puedes ver todas las compras que has realizado.
            </p>
            <Link href="/profile/orders" legacyBehavior>
              <Button variant="outline" className="mt-4 dark:border-gray-600 dark:text-gray-300">
                Ver Historial
              </Button>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
