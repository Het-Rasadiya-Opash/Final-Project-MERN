import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import { Calendar, Users } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

const YourBookListing = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any>([]);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    bookingId: string;
  }>({ isOpen: false, bookingId: "" });

  useEffect(() => {
    const fetchUserBooking = async () => {
      try {
        const res = await apiRequest.get(`/booking/user`);
        setBookings(res.data);
      } catch (error) {
        console.log("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBooking();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const bookingId = params.get("bookingId");

    if (success === "true" && bookingId) {
      apiRequest
        .put("/booking/payment", { bookingId })
        .then(() => {
          window.history.replaceState({}, "", "/profile");
          window.location.reload();
        })
        .catch((err) => console.error("Payment update failed:", err));
    }
  }, []);

  const handleCheckout = async (booking: any) => {
    try {
      const response = await apiRequest.post(
        `/payment/create-checkout-session`,
        {
          listing: booking.listing,
          bookingId: booking._id,
          stayDay: booking.stayDay,
        },
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await apiRequest.delete(`/booking/delete`, {
        data: { bookingId },
      });
      setBookings(bookings.filter((b: any) => b._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
    setConfirmDelete({ isOpen: false, bookingId: "" });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-red-50 p-2 sm:p-2.5 rounded-xl shadow-sm border border-red-100 shrink-0">
            <Calendar size={20} className="text-primary sm:w-5.5 sm:h-5.5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              Your Bookings
            </h2>
            {!loading && (
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Total: {bookings.length}{" "}
                {bookings.length === 1 ? "Booking" : "Bookings"}
              </p>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-[18px] font-semibold text-gray-900 mb-1">
            No bookings yet
          </h2>
          <p className="text-gray-500 text-[14px]">
            Start exploring and book your first stay!
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking: any) => (
            <div
              key={booking._id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-40 h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={booking.listing?.images?.[0] || "/placeholder.jpg"}
                    alt={booking.listing?.title || "Listing"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.listing?.title || "Listing"}
                      </h3>
                    </div>
                    <p className="text-[15px] text-gray-500 mb-3">
                      {booking.listing?.location}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700 font-normal">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400 shrink-0" />
                        {new Date(booking.checkIn).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        –{" "}
                        {new Date(booking.checkOut).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1.5">
                        <Users size={14} className="text-gray-400 shrink-0" />
                        {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between mt-4 md:mt-0 gap-3">
                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-semibold text-gray-900">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          booking.isPaid
                            ? "bg-green-50 text-green-700 border-green-200"
                            : booking.status === "confirmed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : booking.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          booking.isPaid
                            ? "bg-green-500"
                            : booking.status === "confirmed"
                              ? "bg-blue-500"
                              : booking.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`} />
                        {booking.isPaid ? "Paid" : booking.status || "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {booking.status === "pending" && (
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              isOpen: true,
                              bookingId: booking._id,
                            })
                          }
                          className="text-sm font-medium text-gray-700 underline hover:text-red-600 transition"
                        >
                          Cancel
                        </button>
                      )}

                      {booking.status === "confirmed" && !booking.isPaid && (
                        <button
                          onClick={() => handleCheckout(booking)}
                          className="bg-gray-900 hover:bg-black text-white font-semibold py-2.5 px-6 rounded-lg transition active:scale-95 text-[15px]"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, bookingId: "" })}
        onConfirm={() => handleDeleteBooking(confirmDelete.bookingId)}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />
    </div>
  );
};

export default YourBookListing;