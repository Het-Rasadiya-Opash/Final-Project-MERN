import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { useState, useEffect, useRef } from "react";
import apiRequest from "../utils/apiRequest";

const Navbar = () => {
  const { currentUser, removeCurrentUser } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout =async () => {
    try {
      await apiRequest.post("/user/logout", {});
      removeCurrentUser();
      navigate("/");
    } catch (err) {}
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link to="/">
              <h1 className="text-xl font-bold text-gray-800">Listing House</h1>
            </Link>
          </div>
          <div className="flex space-x-4">
            {currentUser ? (
              <div ref={dropdownRef} className="relative">
                <div 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/create-listing"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Create Listing
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
