import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiRequest from "../utils/apiRequest";
import useAuthStore from "../utils/authStore";
import ReviewForm from "../components/ReviewForm";
import Review from "../components/Review";
import Map from "../components/Map";

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

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

  const handleDeleteListing = async () => {
    try {
      await apiRequest.delete(`/listing/${id}`);
      navigate("/profile");
    } catch (error) {
      console.error("Failed to delete listing:", error);
    }
  };

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

  const isOwner = currentUser?._id === listing.owner?._id;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="space-y-4">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={listing.images[currentImage]}
              alt={listing.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {listing.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {listing.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${listing.title} ${idx + 1}`}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-20 w-28 object-cover rounded-lg cursor-pointer transition-all duration-200 ${currentImage === idx
                      ? "ring-2 ring-blue-500"
                      : "opacity-70 hover:opacity-100"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <h1 className="text-3xl font-bold leading-tight">
              {listing.title}
            </h1>

            {(!isOwner && !currentUser?.admin) && (
              <Link to={`/booking/${listing._id}`}>
                <button className="whitespace-nowrap px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition duration-200">
                  Book Now
                </button>
              </Link>
            )}
          </div>

          <div>
            <p className="text-3xl font-bold text-blue-600">
              ₹{listing.price?.toLocaleString()}
              <span className="text-lg font-normal text-gray-600">
                {" "} / per night
              </span>
            </p>
          </div>

          {listing.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
            <div>
              <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm">
                {listing.category}
              </span>
            </div>
          )}

          {listing.description && (
            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold mb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          {listing.owner && (
            <div className="pt-4 border-t space-y-2">
              <h2 className="text-xl font-semibold">
                Owner Information
              </h2>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Username:</span>{" "}
                {listing.owner.username}
              </p>
              <p className="text-gray-700 text-sm break-all">
                <span className="font-medium">Email:</span>{" "}
                {listing.owner.email}
              </p>
            </div>
          )}

          {(isOwner || currentUser?.admin) && (
            <div className="flex flex-wrap gap-4 pt-6 border-t">
              <Link to={`/update-listing/${listing._id}`}>
                <button className="px-6 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition">
                  Edit
                </button>
              </Link>

              <button
                onClick={handleDeleteListing}
                className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {listing.geometry?.coordinates && (
        <div className="mt-16 pt-10 border-t">
          <h2 className="text-2xl font-bold mb-6">
            Location
          </h2>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <Map
              latitude={listing.geometry.coordinates[1]}
              longitude={listing.geometry.coordinates[0]}
              title={listing.title}
            />
          </div>
        </div>
      )}

      <div className="mt-16 pt-10 border-t">
        <h2 className="text-2xl font-bold mb-8">
          Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {currentUser && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Leave a Review
              </h3>
              <ReviewForm
                listingId={id}
                onReviewAdded={() =>
                  setReviewRefresh((prev) => prev + 1)
                }
              />
            </div>
          )}

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              All Reviews
            </h3>
            <Review
              listingId={id}
              refreshTrigger={reviewRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
