"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/app/api/route";

interface Course {
  _id: string;
  courseName: string;
  teacherId: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  classes: string[]; // Lista de nombres de clases
}

export default function CoursePage() {
  const { id } = useParams(); // Obtener el ID del curso desde la URL
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Obtener los detalles del curso por su ID
        const response = await axios.get(`/courses/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el curso:", error);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="text-center">Cargando curso...</div>;
  }

  if (!course) {
    return <div className="text-center">No se encontró el curso.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">{course.courseName}</h1>
      <img
        src={course.imageUrl || "https://via.placeholder.com/300"}
        alt={course.courseName}
        className="w-full h-60 object-cover rounded-md mb-6"
      />
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{course.description}</p>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
        <strong>Categoría:</strong> {course.category}
      </p>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
        <strong>Precio:</strong> ${course.price}
      </p>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Clases</h2>
        {course.classes.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            {course.classes.map((className, index) => (
              <li key={index} className="hover:underline">
                {className}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay clases disponibles para este curso.</p>
        )}
      </div>
    </div>
  );
}
