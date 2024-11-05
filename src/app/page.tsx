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
    const sampleCourses: Course[] = [
      {
        id: "1",
        title: "Desarrollo Web Completo",
        instructor: "Juan Pérez",
        image: "",
        price: 29.99,
        rating: 4.5,
        description: "Aprende a construir sitios web modernos con HTML, CSS y JavaScript.",
      },
      {
        id: "2",
        title: "Introducción a Ciencia de Datos",
        instructor: "Ana Gómez",
        image: "/images/data-science.jpg",
        price: 39.99,
        rating: 4.8,
        description: "Domina los fundamentos de la ciencia de datos con Python.",
      },
      {
        id: "3",
        title: "Marketing Digital para Principiantes",
        instructor: "Carlos Ruiz",
        image: "/images/digital-marketing.jpg",
        price: 24.99,
        rating: 4.6,
        description: "Aprende estrategias clave de marketing digital para crecer tu negocio.",
      },
      {
        id: "4",
        title: "Diseño Gráfico con Photoshop",
        instructor: "Laura Martínez",
        image: "/images/graphic-design.jpg",
        price: 34.99,
        rating: 4.7,
        description: "Conviértete en un experto en diseño gráfico con Adobe Photoshop.",
      },
    ];

    setCourses(sampleCourses);
  }, []);

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Bienvenido a Coderos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Descubre una amplia gama de cursos impartidos por instructores expertos.
          Aprende nuevas habilidades y mejora tu carrera con nuestras categorías de
          desarrollo web, marketing digital, ciencia de datos, diseño gráfico y más.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Categorías Populares
        </h2>
        <div className="flex flex-wrap gap-4">
          {["Desarrollo Web", "Marketing Digital", "Ciencia de Datos", "Diseño Gráfico"].map(
            (category) => (
              <Link key={category} href={`/categories/${category.toLowerCase().replace(" ", "-")}`}>
                {/* Aquí no usamos <a> */}
                <Button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md shadow-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                  {category}
                </Button>
              </Link>
            )
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Cursos Destacados
        </h2>
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
