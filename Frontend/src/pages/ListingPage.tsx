import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiRequest from "../utils/apiRequest";

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await apiRequest.get(`/listing/${id}`);
        setListing(res.data.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!listing)
    return (
      <div className="flex justify-center items-center h-screen">
        Listing not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Slider */}
        <div>
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={listing.images[currentImage]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {/* {listing.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === 0 ? listing.images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev === listing.images.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  →
                </button>
              </>
            )} */}
          </div>
          {listing.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {listing.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${listing.title} ${idx + 1}`}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer ${currentImage === idx ? "ring-2 ring-blue-500" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">
            ₹{listing.price?.toLocaleString()}
          </p>

          {listing.location && (
            <div className="flex items-center text-gray-600 mb-4">
              <svg
                className="w-5 h-5 mr-2"
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
            </div>
          )}

          {listing.category && (
            <div className="mb-4">
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {listing.category}
              </span>
            </div>
          )}

          {listing.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          {listing.owner && (
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Owner Information</h2>
              <p className="text-gray-700">
                Username: {listing.owner.username}
              </p>
              <p className="text-gray-700">Email: {listing.owner.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
