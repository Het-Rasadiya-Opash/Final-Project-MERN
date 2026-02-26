import { useEffect, useState } from "react";
import useAuthStore from "../utils/authStore";
import apiRequest from "../utils/apiRequest";
import Listing from "../components/Listing";
import { User, Mail, Calendar, Package } from "lucide-react";

const Profile = () => {
  const { currentUser } = useAuthStore();
  const [listings, setListings] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  if (!currentUser)
    return <div className="p-8">Please log in to view your profile.</div>;

  useEffect(() => {
    const fetchUserListing = async () => {
      try {
        const res = await apiRequest.get(`listing/user-listing`);
        setListings(res.data.data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserListing();
  }, []);

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
                <span className="text-lg font-semibold text-gray-800">{currentUser.username}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-600" />
                <span className="text-sm text-gray-500">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Your Listings</h2>
            {!loading && <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">{listings.length}</span>}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No listings yet</p>
              <p className="text-gray-400 text-sm mt-1">Start creating your first listing!</p>
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
