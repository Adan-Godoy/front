import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import api from "../app/api/route";
import { useFavorites } from "@/context/FavoritesContext";

interface Course {
  id: string;
  _id?: string; 
  courseName: string;
  teacherId: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);
};

const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Nuevo estado
  const { cartItems, addToCart } = useCart();
  const { favoriteItems, addToFavorites } = useFavorites();

  const [toast, setToast] = useState<{ show: boolean; courseName: string }>({
    show: false,
    courseName: "",
  });

  useEffect(() => {
    // Verifica si existe un token en localStorage
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Cambia el estado según la existencia del token
  }, []);

  useEffect(() => {
    const fetchRandomCourses = async () => {
      try {
        const response = await api.get<Course[]>("/courses");
        const allCourses = response.data.map((course) => ({
          ...course,
          id: course._id ? course._id.toString() : "", // Asegúrate de que `id` sea siempre un string
        }));
    
        const selectedCourses =
          allCourses.length <= 6
            ? allCourses
            : allCourses.sort(() => 0.5 - Math.random()).slice(0, 6);
    
        setCourses(selectedCourses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    
    fetchRandomCourses();
  }, []);
  
  const handleAddToCart = (course: Course) => {
    addToCart(course);
    setToast({ show: true, courseName: course.courseName });

    setTimeout(() => {
      setToast({ show: false, courseName: "" });
    }, 3000);
  };

  const handleAddToFavorites = (course: Course) => {
    addToFavorites(course);
    setToast({ show: true, courseName: course.courseName });

    setTimeout(() => {
      setToast({ show: false, courseName: "" });
    }, 3000);
  };

  if (loading) return <p className="text-center">Cargando cursos...</p>;
  if (!loading && courses.length === 0) return <p className="text-center">No hay cursos disponibles en este momento.</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isInCart = cartItems.some((item) => item.id === course.id);
          const isInFavorites = favoriteItems.some((item) => item.id === course.id);

          return (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center">
              <img
                src={course.imageUrl || "https://via.placeholder.com/150"}
                alt={course.courseName}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{course.courseName}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4">{course.description}</p>
              <p className="text-gray-800 dark:text-gray-200 font-bold mb-4">{formatPrice(course.price)}</p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => !isInCart && handleAddToCart(course)}
                  className={`px-4 py-2 rounded-md ${
                    isInCart
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-blue-800 text-white hover:bg-blue-900"
                  }`}
                  disabled={isInCart}
                >
                  {isInCart ? "Ya añadido" : "Agregar al Carrito"}
                </Button>
                {isLoggedIn && ( // Muestra este botón solo si el usuario está logeado
                  <Button
                    onClick={() => !isInFavorites && handleAddToFavorites(course)}
                    className={`px-4 py-2 rounded-md ${
                      isInFavorites
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : "bg-red-800 text-white hover:bg-red-900"
                    }`}
                    disabled={isInFavorites}
                  >
                    {isInFavorites ? "En Favoritos" : "Añadir a Favoritos"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md shadow-lg flex items-center space-x-4">
          <p>{`¡${toast.courseName} se ha añadido a favoritos!`}</p>
        </div>
      )}
    </>
  );
};

export default CoursesList;
