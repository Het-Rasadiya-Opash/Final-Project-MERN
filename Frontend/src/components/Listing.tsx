import { useNavigate } from "react-router-dom";
import { Heart, MapPin } from "lucide-react"; // Install lucide-react or use SVG

interface ListingProps {
  listing: {
    _id: string;
    title: string;
    images: string[];
    price?: number;
    location?: string;
    owner?: { _id: string; username?: string; email?: string };
  };
}

const Listing = ({ listing }: ListingProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="group cursor-pointer flex flex-col gap-2 w-full"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <img
          src={listing.images[0] || "/placeholder-image.jpg"}
          alt={listing.title}
          className="h-full w-full object-cover transition group-hover:scale-105 duration-300"
        />

        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="hover:scale-110 transition"
          >
            <Heart className="text-white fill-black/20" size={24} />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-md">
          1 / {listing.images.length}
        </div>
      </div>

      <div className="flex flex-col pt-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[15px] text-gray-900 line-clamp-1 flex items-center gap-1">
            <MapPin size={16} className="text-gray-600" />
            {listing.location || "Location unlisted"}
          </h3>
        </div>

        <p className="text-gray-500 font-light text-sm line-clamp-1">
          {listing.title}
        </p>

        <p className="text-gray-500 font-light text-sm mb-1">
          Stay with {listing.owner?.username || "Host"}
        </p>

        <div className="mt-1">
          <span className="font-semibold text-gray-900">
            ₹{listing.price?.toLocaleString()}
          </span>
          <span className="font-light text-gray-700"> night</span>
        </div>
      </div>
    </div>
  );
};

export default Listing;
