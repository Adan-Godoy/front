// components/Curso.tsx
import Link from "next/link";
import Image from "next/image";

type CursoProps = {
  id: string;
  title: string;
  instructor: string;
  image: string;
  price: number;
  rating: number;
  description: string;
};

export default function Curso({
  id,
  title,
  instructor,
  image,
  price,
  rating,
  description,
}: CursoProps) {
  return (
    (<div className="bg-white shadow-md rounded-md overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">Instructor: {instructor}</p>
        <p className="text-yellow-500">
          {Array.from({ length: Math.round(rating) }, () => "⭐").join(" ")}
        </p>
        <p className="text-gray-500 mt-2">{description.slice(0, 60)}...</p>
        <p className="text-blue-600 font-semibold mt-4">${price.toFixed(2)}</p>
        <Link
          href={`/courses/${id}`}
          className="text-blue-500 hover:underline mt-2 block">
          Ver curso
        </Link>
      </div>
    </div>)
  );
}
