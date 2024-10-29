"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Curso from "../components/ui/curso";

type Course = {
  id: string;
  title: string;
  instructor: string;
  image: string;
  price: number;
  rating: number;
  description: string;
};

function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simulación de llamada al microservicio de cursos
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses"); // Cambia a la URL de tu microservicio real
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto p-8">
      {/* Mensaje de Bienvenida */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a Coderos</h1>
        <p className="text-lg text-gray-600">
          Descubre una amplia gama de cursos impartidos por instructores expertos.
          Aprende nuevas habilidades y mejora tu carrera con nuestras categorías de
          desarrollo web, marketing digital, ciencia de datos, diseño gráfico y más.
        </p>
      </section>

      {/* Categorías de cursos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categorías Populares</h2>
        <div className="flex flex-wrap gap-4">
          {["Desarrollo Web", "Marketing Digital", "Ciencia de Datos", "Diseño Gráfico"].map(
            (category) => (
              <Link key={category} href={`/categories/${category.toLowerCase().replace(" ", "-")}`}>
                <Button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md shadow-md hover:bg-blue-200">
                  {category}
                </Button>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Lista de cursos destacados */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cursos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Curso
              key={course.id}
              id={course.id}
              title={course.title}
              instructor={course.instructor}
              image={course.image}
              price={course.price}
              rating={course.rating}
              description={course.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
