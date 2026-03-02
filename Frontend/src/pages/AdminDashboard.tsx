import { useState, useEffect } from "react";
import apiRequest from "../utils/apiRequest";
import { Users, Home, MessageSquare, Menu, X } from "lucide-react";

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
      {["overview", "listing", "review", "user"].map((tab) => (
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
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
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
                        </tr>
                      ))}
                    {activeTab === "user" &&
                      users.map((user: any) => (
                        <tr key={user._id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.username}
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
