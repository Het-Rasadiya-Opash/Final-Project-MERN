import useAuthStore from '../utils/authStore';
import { User } from 'lucide-react';

const Profile = () => {
    const {currentUser} = useAuthStore();
    
    if(!currentUser) return <div className="p-8">Please log in to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <User size={48} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        
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
    </div>
  )
}

export default Profile
