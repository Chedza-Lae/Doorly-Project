import { Link } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

interface ServiceCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  location: string;
  provider: string;
}

export default function ServiceCard({
  id,
  image,
  title,
  price,
  rating,
  reviews,
  location,
}: ServiceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link to={`/service/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/service/${id}`}>
          <h3 className="text-gray-900 mb-2 line-clamp-1 hover:text-[#1E3A8A]">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-900">{rating}</span>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Desde</p>
            <p className="text-[#1E3A8A]">{price}</p>
          </div>
          <Link
            to={`/service/${id}`}
            className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#3B82F6] transition-colors text-sm"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
