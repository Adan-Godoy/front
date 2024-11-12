"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CoursesList from '../components/CoursesList';



function HomePage() {

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
              <Link
                key={category}
                href={`/categories/${category.toLowerCase().replace(" ", "-")}`}
                legacyBehavior>
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
        <CoursesList />  
      </section>
    </div>
  );
}

export default HomePage;