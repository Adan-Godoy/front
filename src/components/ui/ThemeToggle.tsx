// components/ui/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import useAuthStore from "@/store/authStore";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const token = useAuthStore((state) => state.token); // Obtener el token de autenticación
  const [mounted, setMounted] = useState(false);

  // Asegurarse de que el componente solo se renderice en el cliente
  useEffect(() => {
    setMounted(true);

    // Si el usuario no está autenticado, establecer el tema en "light" una vez
    if (!token && theme === "dark") {
      setTheme("light");
    }
  }, [token, theme, setTheme]);

  if (!mounted) return null;

  const toggleTheme = () => {
    // Solo permitir el cambio de tema si el usuario está autenticado
    if (token) {
      setTheme(theme === "dark" ? "light" : "dark");
    } else {
      setTheme("light"); // Mantener el tema claro si no está autenticado
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
}
