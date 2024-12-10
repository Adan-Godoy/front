"use client";

import { useEffect, useState } from "react";
import axios from "@/app/api/route";
import { Button } from "@/components/ui/button";

interface Transaction {
  _id: string;
  order: string;
  amount: number;
  items: string[];
  status: string;
  createdAt: string;
}

interface Course {
  id: string;
  courseName: string;
  imageUrl: string;
}

export default function OrderHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get(`/payment/transactions/${userId}`);
        setTransactions(response.data);

        const courseIds = response.data.flatMap((transaction: Transaction) => transaction.items);
        const courseDetails = await axios.post("/courses/details", { ids: courseIds });
        setCourses(courseDetails.data);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el historial:", error);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando historial de compras...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center">No tienes transacciones aún.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Historial de Compras</h1>
      <div className="space-y-6">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded p-6 space-y-4"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold dark:text-gray-100">Orden: {transaction.order}</h2>
              <p className="dark:text-gray-300">
                Estado: <strong>{transaction.status}</strong>
              </p>
            </div>
            <p className="dark:text-gray-300">
              Fecha de Compra: {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
            <p className="dark:text-gray-300">
              Total: <strong>${transaction.amount}</strong>
            </p>
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Cursos Comprados:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {transaction.items.map((itemId) => {
                  const course = courses.find((course) => course.id === itemId);
                  return course ? (
                    <div
                      key={course.id}
                      className="bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-md"
                    >
                      <img
                        src={course.imageUrl || "https://via.placeholder.com/150"}
                        alt={course.courseName}
                        className="w-full h-24 object-cover rounded"
                      />
                      <p className="text-sm mt-2 dark:text-gray-200">{course.courseName}</p>
                    </div>
                  ) : (
                    <p key={itemId} className="text-sm dark:text-gray-300">
                      Curso ID: {itemId}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
