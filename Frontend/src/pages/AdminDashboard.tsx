import { useState, useEffect } from "react";
import apiRequest from "../utils/apiRequest";
import {
  Users,
  Home,
  MessageSquare,
  Menu,
  X,
  Trash2,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalReviews: 0,
  });
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiRequest.get("/user/admin");
        setStats(data);
        setListings(data.listings);
        setReviews(data.reviews);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const res = await apiRequest.get("/booking/");
        console.log(res.data)
        setBookings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllBookings();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Total Listings",
      value: stats.totalListings,
      icon: Home,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Total Reviews",
      value: stats.totalReviews,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  const NavItems = () => (
    <nav className="p-4">
      {["overview", "listing", "review", "user", "bookings"].map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 mb-2 rounded-lg capitalize transition ${
            activeTab === tab
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-gray-100"
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

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <NavItems />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm p-4 lg:hidden flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
          <div className="w-6" />
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <h2 className="hidden lg:block text-3xl font-bold text-gray-800 mb-6 capitalize">
            {activeTab}
          </h2>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  Loading...
                </div>
              ) : (
                statCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white rounded-lg shadow p-6">
                      <div
                        className={`w-12 h-12 ${stat.bg} rounded-lg mb-4 flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                      <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                        {stat.value}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {activeTab === "listing" && (
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          City
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    )}
                    {activeTab === "review" && (
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Comment
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Rating
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    )}
                    {activeTab === "user" && (
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Username
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Joined
                        </th>
                      </tr>
                    )}
                    {activeTab === "bookings" && (
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Listing
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Dates
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Guests
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    )}
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
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status || "pending"}
                            </span>
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
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {review.owner?.username || "N/A"}
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
