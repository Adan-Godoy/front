// components/Navbar.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  UserCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { data: session, status } = useSession(); // Usar session para verificar autenticación
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const handleMouseEnter = () => {
    setIsCategoriesOpen(true);
  };

  const handleMouseLeave = () => {
    setIsCategoriesOpen(false);
  };

  return (
    <nav className="p-4 bg-white dark:bg-gray-900 shadow-md flex justify-between items-center transition-colors duration-300">
      {isMobileView && (
        <button onClick={toggleMenu} className="focus:outline-none">
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      )}
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Coderos
        </Link>
        {!isMobileView && (
          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none">
              Categorías
            </button>
            {isCategoriesOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md">
                <ul className="text-gray-700 dark:text-gray-200 py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Link href="/categories/web-development">Desarrollo Web</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Link href="/categories/digital-marketing">Marketing Digital</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Link href="/categories/data-science">Data Science</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Link href="/categories/graphic-design">Diseño Gráfico</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {!isMobileView && (
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-lg mx-4">
          <Input placeholder="Buscar..." className="w-full dark:bg-gray-700 dark:text-gray-200" />
          <Button className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>
      )}
      <div className="flex space-x-4 items-center">
        <Link href="/cart" legacyBehavior>
          <ShoppingCartIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </Link>

        {/* Mostrar botones según el estado de sesión */}
        {!isMobileView && status === "authenticated" ? (
          <div className="flex space-x-2 items-center">
            <Link href="/learning" legacyBehavior>
              <BookOpenIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Mi Aprendizaje" />
            </Link>
            <Link href="/favorites" legacyBehavior>
              <HeartIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Favoritos" />
            </Link>
            <Link href="/profile" legacyBehavior>
              <UserCircleIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Perfil" />
            </Link>
          </div>
        ) : (
          !isMobileView && (
            <div className="hidden md:flex space-x-2">
              <Link href="/login" legacyBehavior>
                <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/signup" legacyBehavior>
                <Button className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                  Registrar
                </Button>
              </Link>
            </div>
          )
        )}

        {isMobileView && (
          <button onClick={toggleSearch}>
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        )}
      </div>
      {isMobileView && menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 shadow-md p-4 transition-colors duration-300">
          <div className="flex flex-col space-y-4 text-left">
            {status === "authenticated" ? (
              <>
                <Link href="/learning" className="text-gray-700 dark:text-gray-200">
                  Mi Aprendizaje
                </Link>
                <Link href="/favorites" className="text-gray-700 dark:text-gray-200">
                  Favoritos
                </Link>
                <Link href="/profile" className="text-gray-700 dark:text-gray-200">
                  Perfil
                </Link>
                <Button onClick={() => signOut()} className="text-gray-700 dark:text-gray-200">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login" legacyBehavior>
                  <Button variant="outline" className="w-auto dark:border-gray-600 dark:text-gray-200">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/signup" legacyBehavior>
                  <Button className="w-auto dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    Registrar
                  </Button>
                </Link>
              </div>
              
            )}
            <Link href="/categories" className="text-gray-400 dark:text-gray-500">
              Categorías
            </Link>
            <ul className="text-gray-500 dark:text-gray-400 space-y-2 pl-4">
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