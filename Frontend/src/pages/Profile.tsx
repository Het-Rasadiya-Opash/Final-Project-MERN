import ListingOwnerBooking from "../components/ListingOwnerBooking";
import UserProfileDetail from "../components/UserProfileDetail";
import YourBookListing from "../components/YourBookListing";
import YourListing from "../components/YourListing";

const Profile = () => {


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <UserProfileDetail />
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <YourBookListing />
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6  mb-8">
          <YourListing />
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <ListingOwnerBooking />
        </div>
      </div>
    </div>
  );
};

export default Profile;
