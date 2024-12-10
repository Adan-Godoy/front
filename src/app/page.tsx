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