import { useEffect, useState } from "react";
import useAuthStore from "../utils/authStore";
import apiRequest from "../utils/apiRequest";
import Listing from "../components/Listing";
import { User, Mail, Calendar, Package, Download } from "lucide-react";

const Profile = () => {
  const { currentUser } = useAuthStore();
  const [listings, setListings] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  if (!currentUser)
    return <div className="p-8">Please log in to view your profile.</div>;

  useEffect(() => {
    const fetchUserListing = async () => {
      try {
        const res = await apiRequest.get(`/listing/user-listing`);
        setListings(res.data.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserListing();
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await apiRequest.get(`/listing/csv-data`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the CSV file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-bold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <User size={18} className="text-gray-600" />
                <span className="text-lg font-semibold text-gray-800">
                  {currentUser.username}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {currentUser.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-600" />
                <span className="text-sm text-gray-500">
                  Member since{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-blue-50 p-2 sm:p-2.5 rounded-xl shadow-sm border border-blue-100 shrink-0">
                <Package
                  size={20}
                  className="text-blue-600 sm:w-5.5 sm:h-5.5"
                />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                  Your Listings
                </h2>
                {!loading && (
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Total: {listings.length}{" "}
                    {listings.length === 1 ? "Listing" : "Listings"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <Download
                  size={18}
                  className="text-gray-400 group-hover:text-blue-600 transition-colors"
                />
                <span className="transition-colors">Export CSV</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No listings yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start creating your first listing!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing: any) => (
                <Listing key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
