"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/app/api/route";

interface Course {
  id: string;
  courseName: string;
  description: string;
  imageUrl: string;
  progress: number; // Progreso del curso (puedes simularlo si no está disponible)
}

interface Transaction {
  _id: string;
  items: string[]; // IDs de los cursos
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        window.location.href = "/login"; // Redirigir si no hay usuario logueado
        return;
      }

      try {
        // 1. Obtener las transacciones
        const transactionsResponse = await axios.get<Transaction[]>(`/payment/transactions/${userId}`);
        const courseIds = transactionsResponse.data.flatMap((transaction) => transaction.items);

        // 2. Obtener los detalles de los cursos
        const coursesResponse = await axios.post(`/courses/details`, { ids: courseIds });
        setCourses(coursesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de aprendizaje:", error);
      }
    };

    fetchLearningData();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando tus cursos...</div>;
  }

  if (courses.length === 0) {
    return <div className="text-center">No tienes cursos inscritos todavía.</div>;
  }

  return (
    <div className="container mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Mi Aprendizaje</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <img
              src={course.imageUrl || "https://via.placeholder.com/150"}
              alt={course.courseName}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{course.courseName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{course.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Progreso: {course.progress || 0}%</p>
            <Link href={`/courses/${course.id}`}>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                Ir al Curso
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
