import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiRequest from "../utils/apiRequest";

const BookingForm = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const { listingId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await apiRequest.get(`/listing/${listingId}`);
        setListing(res.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Something went wrong");
      }
    };
    fetchListing();
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest.post(`/booking/${listingId}`, {
        checkIn,
        checkOut,
        guests,
      });
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      navigate("/profile");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {listing ? (
              <div className="p-0">
                <div className="relative aspect-16/10 sm:aspect-video bg-gray-200">
                  <img
                    src={listing.images[currentImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                </div>

                <div className="p-6">
                  {listing.images.length > 1 && (
                    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                      {listing.images.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImage === idx
                              ? "border-blue-600 ring-2 ring-blue-100"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={img}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {listing.title}
                      </h1>
                      <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {listing.location}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {listing.description}
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{listing.price.toLocaleString()}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          / night
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="lg:col-span-5">
            {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Book Your Stay
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkIn"
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                    >
                      Check In
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkOut"
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                    >
                      Check Out
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="guests"
                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                  >
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transform active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
                  >
                    Book Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
