// components/Navbar.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024); // Define breakpoint for mobile view
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const handleMouseEnter = () => {
    setIsCategoriesOpen(true);
  };

  const handleMouseLeave = () => {
    setIsCategoriesOpen(false);
  };

  return (
    <nav className="p-4 bg-white shadow-md flex justify-between items-center">
      {/* Icono del menú hamburguesa (solo en móvil) */}
      {isMobileView && (
        <button onClick={toggleMenu} className="focus:outline-none">
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      )}

      {/* Logo y categorías (solo en pantallas grandes) */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          Coderos
        </Link>
        {!isMobileView && (
          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-gray-700 hover:text-gray-900 focus:outline-none">
              Categorías
            </button>
            {/* Menú desplegable de categorías */}
            {isCategoriesOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md"
                onMouseEnter={handleMouseEnter} // Mantener abierto al pasar el mouse
                onMouseLeave={handleMouseLeave} // Cerrar al salir del área del menú
              >
                <ul className="text-gray-700 py-2">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/categories/web-development">Desarrollo Web</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/categories/digital-marketing">Marketing Digital</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/categories/data-science">Data Science</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link href="/categories/graphic-design">Diseño Gráfico</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra de búsqueda en pantallas grandes */}
      {!isMobileView && (
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-lg mx-4">
          <Input placeholder="Buscar..." className="w-full" />
          <Button>
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>
      )}

      {/* Iconos de carrito y botones de sesión */}
      <div className="flex space-x-4 items-center">
        <Link href="/cart">
          <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
        </Link>
        {!isMobileView && (
          <div className="hidden md:flex space-x-2">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Registrar</Button>
            </Link>
          </div>
        )}
        {/* Icono de búsqueda (solo en móvil) */}
        {isMobileView && (
          <button onClick={toggleSearch}>
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Menú desplegable para móviles */}
      {isMobileView && menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4">
          <div className="flex flex-col space-y-4 text-left">
            {/* Botones de sesión en la parte superior y alineados a la izquierda */}
            <div className="flex space-x-2">
              <Link href="/login">
                <Button variant="outline" className="w-auto">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-auto">Registrar</Button>
              </Link>
            </div>
            {/* Categorías después de los botones */}
            <Link href="/categories" className="text-gray-400">
              Categorías
            </Link>
            <ul className="text-gray-500 space-y-2 pl-4">
              <li>Desarrollo Web</li>
              <li>Marketing Digital</li>
              <li>Data Science</li>
              <li>Diseño Gráfico</li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export { Navbar };
