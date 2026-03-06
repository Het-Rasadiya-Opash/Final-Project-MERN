import useAuthStore from "../utils/authStore";
import { User, Mail, Calendar } from "lucide-react";
import ListingOwnerBooking from "../components/ListingOwnerBooking";
import YourBookListing from "../components/YourBookListing";
import YourListing from "../components/YourListing";

const Profile = () => {
  const { currentUser } = useAuthStore();

  if (!currentUser)
    return <div className="p-8">Please log in to view your profile.</div>;

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
                  {new Date(currentUser.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <YourBookListing />
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6  mb-8">
         <YourListing/>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <ListingOwnerBooking />
        </div>
      </div>
    </div>
  );
};

export default Profile;
