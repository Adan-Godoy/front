// src/components/CoursesList.jsx
// src/components/CoursesList.jsx

import { useEffect, useState } from 'react';
import { Course } from '@/types/courses';
import { Button } from '@/components/ui/button'; // Asegúrate de tener el botón de ShadCN configurado

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch('/api/courses');
      const data: Course[] = await response.json();
      setCourses(data);
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lista de Cursos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{course.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{course.description}</p>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Precio: ${course.price}
            </p>
            <Button className="w-full mt-4">Comprar</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
