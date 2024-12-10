"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "@/app/api/route";

interface Course {
  id: string;
  courseName: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

const normalizeString = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD") // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, ""); // Elimina marcas diacríticas

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>(""); // Opciones de ordenamiento

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get<Course[]>("/courses");
        const allCourses = response.data;

        // Filtrar cursos según el término de búsqueda
        const filtered = allCourses.filter(
          (course) =>
            normalizeString(course.courseName).includes(
              normalizeString(query)
            ) ||
            normalizeString(course.category).includes(normalizeString(query))
        );

        setCourses(filtered);
        setFilteredCourses(filtered);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    let sortedCourses = [...courses];
    if (sortOption === "price-asc") {
      sortedCourses.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      sortedCourses.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      sortedCourses.sort((a, b) =>
        a.courseName.localeCompare(b.courseName, "es", { sensitivity: "base" })
      );
    } else if (sortOption === "name-desc") {
      sortedCourses.sort((a, b) =>
        b.courseName.localeCompare(a.courseName, "es", { sensitivity: "base" })
      );
    }
    setFilteredCourses(sortedCourses);
  }, [sortOption, courses]);

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        Resultados de la búsqueda: "{query}"
      </h1>

      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
        >
          <option value="">Ordenar por...</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Cargando cursos...</p>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              <img
                src={course.imageUrl || "https://via.placeholder.com/150"}
                alt={course.courseName}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {course.courseName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4">
                {course.description}
              </p>
              <p className="text-gray-800 dark:text-gray-200 font-bold mb-4">
                ${course.price.toLocaleString()}
              </p>
              <Button className="bg-blue-800 text-white hover:bg-blue-900">
                Ver más
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No se encontraron resultados para "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
