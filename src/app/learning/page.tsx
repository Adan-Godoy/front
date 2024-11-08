"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type LearningItem = {
  id: string;
  name: string;
  image: string;
  instructor: string;
  progress: number;
};

function MyLearningPage() {
  const [learningItems, setLearningItems] = useState<LearningItem[]>([
    {
      id: "1",
      name: "Curso de Desarrollo Web",
      image: "/images/web-development.jpg",
      instructor: "Juan Pérez",
      progress: 50,
    },
    {
      id: "2",
      name: "Curso de Ciencia de Datos",
      image: "/images/data-science.jpg",
      instructor: "Ana Gómez",
      progress: 75,
    },
  ]);

  return (
    <div className="container mx-auto p-8 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Mi Aprendizaje</h1>

      {learningItems.length > 0 ? (
        <div className="space-y-6">
          {learningItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">Instructor: {item.instructor}</p>
                  <p className="text-gray-600 dark:text-gray-300">Progreso: {item.progress}%</p>
                </div>
              </div>
              <Button className="bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                Continuar
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">No estás inscrito en ningún curso.</p>
      )}
    </div>
  );
}

export default MyLearningPage;
