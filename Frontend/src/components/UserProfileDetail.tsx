import useAuthStore from "../utils/authStore";
import { User, Mail, Calendar } from "lucide-react";

const UserProfileDetail = () => {
    const { currentUser } = useAuthStore();

    if (!currentUser)
        return <div className="p-8">Please log in to view your profile.</div>;
    return (
        <>
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
        </>
    )
}

export default UserProfileDetail
