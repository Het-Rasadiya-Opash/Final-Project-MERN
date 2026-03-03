import { useState, useEffect } from "react";
import apiRequest from "../utils/apiRequest";
import {
  Users,
  Home,
  MessageSquare,
  Menu,
  X,
  Trash2,
  Ticket,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalReviews: 0,
    totalBookings: 0,
  });
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiRequest.get("/user/admin");
        setStats(data);
        setListings(data.listings);
        setReviews(data.reviews);
        setUsers(data.users);
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Listings", value: stats.totalListings, icon: Home, color: "text-green-500", bg: "bg-green-50" },
    { label: "Total Reviews", value: stats.totalReviews, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Total Bookings", value: stats.totalBookings, icon: Ticket, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const NavItems = () => (
    <nav className="p-4 space-y-2">
      {["overview", "listing", "review", "user", "bookings"].map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg transition capitalize font-medium ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await apiRequest.delete(`/listing/${listingId}`);
      setListings(listings.filter((l: any) => l._id !== listingId));
      setStats((prev) => ({ ...prev, totalListings: prev.totalListings - 1 }));
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing");
    }
  };

  const handleDeleteReview = async (reviewId: string, listingId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await apiRequest.delete(`/review/delete/${listingId}`, {
        data: { reviewId },
      });
      setReviews(reviews.filter((r: any) => r._id !== reviewId));
      setStats((prev) => ({ ...prev, totalReviews: prev.totalReviews - 1 }));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await apiRequest.put(`/booking/status`, {
        bookingId: bookingId,
        status: newStatus
      });
      setBookings(bookings.map((b) =>
        b._id === bookingId ? { ...b, status: newStatus } : b
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await apiRequest.delete(`/booking/delete`, {
        data: { bookingId }
      })
      setBookings(bookings.filter((b) => b._id !== bookingId))
      setStats((prev) => ({ ...prev, totalBookings: prev.totalBookings - 1 }))
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking")
    }
  }


  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <NavItems />
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 lg:hidden flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
          <div className="w-6" />
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <h2 className="hidden lg:block text-3xl font-bold text-gray-800 mb-6 capitalize">{activeTab}</h2>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">Loading...</div>
              ) : (
                statCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
                      <div className={`w-12 h-12 ${stat.bg} rounded-lg mb-4 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="bg-white rounded-2xl shadow overflow-x-auto border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {activeTab === "listing" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </>
                    )}
                    {activeTab === "review" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </>
                    )}
                    {activeTab === "user" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      </>
                    )}
                    {activeTab === "bookings" && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTab === "bookings" &&
                    bookings.map((booking: any) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {booking.customer?.username
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.customer?.username || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.customer?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {booking.listing?.title || "Deleted Listing"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.listing?.location || "Unknown location"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            to{" "}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.guests}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{booking.totalPrice?.toLocaleString() || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {booking.status === "pending" ? (
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg border-2 cursor-pointer transition-all bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg ${booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                                }`}
                            >
                              {booking.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              handleDeleteBooking(booking._id)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {activeTab === "listing" &&
                    listings.map((listing: any) => (
                      <tr key={listing._id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {listing.title}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{listing.price}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {listing.location}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {listing.category}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {activeTab === "review" &&
                    reviews.map((review: any) => (
                      <tr key={review._id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {review?.owner.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {review.owner.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {review.comment}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ⭐ {review.rating}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() =>
                              handleDeleteReview(review._id, review.listing)
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {activeTab === "user" &&
                    users.map((user: any) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {user?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.admin ? "Admin" : "User"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;