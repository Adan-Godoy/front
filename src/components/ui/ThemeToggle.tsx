"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light"); // Estado local para el tema
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [mounted, setMounted] = useState(false);

  // Verificar autenticación y tema inicial
  useEffect(() => {
    setMounted(true);

    // Comprobar si hay un token en localStorage
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token); // Cambia isAuthenticated a true si existe el token

    // Leer el tema actual del localStorage
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.add(storedTheme); // Asegurar que el tema se aplique al cargar
  }, []);

  const toggleTheme = () => {
    if (isAuthenticated) {
      // Alternar entre "light" y "dark" solo si el usuario está autenticado
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme); // Guardar el tema en localStorage

      // Cambiar la clase de HTML para reflejar el tema
      document.documentElement.classList.remove(theme);
      document.documentElement.classList.add(newTheme);
    } else {
      setTheme("light"); // Si no está autenticado, mantener el tema en claro
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return null; // Evitar el renderizado hasta que esté montado

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
