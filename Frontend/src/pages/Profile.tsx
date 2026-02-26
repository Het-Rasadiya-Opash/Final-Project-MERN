import { useEffect, useState } from "react";
import useAuthStore from "../utils/authStore";
import apiRequest from "../utils/apiRequest";
import Listing from "../components/Listing";

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
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white shadow rounded-lg p-6">
        

        <div className="space-y-4">
          <div>
            <label className="text-gray-600 font-semibold">Username</label>
            <p className="text-lg">{currentUser.username}</p>
          </div>

          <div>
            <label className="text-gray-600 font-semibold">Email</label>
            <p className="text-lg">{currentUser.email}</p>
          </div>
        </div>
      </div>
      {
        loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Listings</h2>
            {listings.length === 0 ? (
              <p className="text-gray-600">No listings found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing: any) => (
                  <Listing key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};

export default Profile;
