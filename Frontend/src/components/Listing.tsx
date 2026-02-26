import { useNavigate } from "react-router-dom";

interface ListingProps {
  listing: {
    _id: string;
    title: string;
    images: string[];
    price?: number;
    location?: string;
    owner?: {
      _id: string;
      username?: string;
      email?: string;
    };
  };
}

const Listing = ({ listing }: ListingProps) => {
  const navigate = useNavigate();


  return (
    <div
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative">
        <img
          src={listing.images[0] || "/placeholder-image.jpg"}
          alt={listing.title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
          {listing.images.length} photos
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {listing.title}
        </h3>
        {listing.location && (
          <p className="text-gray-600 text-sm mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {listing.location}
          </p>
        )}
        {listing.price && (
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            ₹{listing.price.toLocaleString()}
          </p>
        )}
        
      </div>
    </div>
  );
};

export default Listing;
