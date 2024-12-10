"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  UserCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import axios from "../app/api/route";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    // Check if accessToken exists in localStorage
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    handleResize();
    window.addEventListener("resize", handleResize);

    // Fetch categories dynamically
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/courses");
        const uniqueCategories = Array.from(
          new Set(response.data.map((course: any) => course.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?query=${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    router.push("/login");
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
            className="relative"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none">
              Categorías
            </button>
            {isCategoriesOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50"
                style={{ paddingTop: "10px", paddingBottom: "10px" }} // Agregar espacio para el área de detección
              >
                <ul className="text-gray-700 dark:text-gray-200 py-2">
                  {categories.map((category) => (
                    <li
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {!isMobileView && (
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-lg mx-4">
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full dark:bg-gray-700 dark:text-gray-200"
          />
          <Button onClick={handleSearch} className="dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Buscar
          </Button>
        </div>
      )}
      <div className="flex space-x-4 items-center">
        <Link href="/cart">
          <ShoppingCartIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </Link>
        <Link href="/chat">
          <ChatBubbleLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Chat con Nina" />
        </Link>

        {!isMobileView && isAuthenticated ? (
          <div className="flex space-x-2 items-center">
            <Link href="/learning">
              <BookOpenIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Mi Aprendizaje" />
            </Link>
            <Link href="/favorites">
              <HeartIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Favoritos" />
            </Link>
            <Link href="/profile">
              <UserCircleIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" title="Perfil" />
            </Link>
          </div>
        ) : (
          !isMobileView && (
            <div className="hidden md:flex space-x-2">
              <Link href="/login">
                <Button variant="outline" className="dark:border-gray-600 dark:text-gray-200">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/signup">
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
    </nav>
  );
}
