import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../utils/authStore";
import { useState, useEffect, useRef } from "react";
import apiRequest from "../utils/apiRequest";
import { Menu, User } from "lucide-react";

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

  const handleLogout = async () => {
    try {
      await apiRequest.post("/user/logout", {});
      removeCurrentUser();
      setShowDropdown(false);
      navigate("/");
    } catch (err) { }
  };

  return (
    <nav className="fixed w-full bg-white z-60 border-b border-gray-200">
      <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="flex flex-row items-center justify-between gap-3 md:gap-0 h-20">

          <Link to="/" className="flex items-center gap-1 text-blue-500">
            <div className="font-bold text-xl md:text-2xl tracking-tight">
              listinghouse
            </div>
          </Link>



          <div className="relative" ref={dropdownRef}>
            <div className="flex flex-row items-center gap-3">
              <Link to="/create-listing"> <div className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                Listing House your home
              </div></Link>

              <div className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                onClick={() => setShowDropdown(!showDropdown)}>
                <Menu size={18} />
                <div className="hidden md:block">
                  {currentUser ? (
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User size={24} className="text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {showDropdown && (
              <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm border border-neutral-100 py-2 z-70">
                <div className="flex flex-col cursor-pointer">
                  {currentUser ? (
                    <>
                      <Link to="/profile" className="px-4 py-3 hover:bg-neutral-100 font-semibold transition">Profile</Link>
                      <Link to="/create-listing" className="px-4 py-3 hover:bg-neutral-100 transition">Create Listing</Link>
                      <Link to="/wishlist" className="px-4 py-3 hover:bg-neutral-100 transition">Wishlist</Link>
                      {currentUser.admin && <Link to="/admin" className="px-4 py-3 hover:bg-neutral-100 transition">Dashboard</Link>}
                      <hr className="my-1" />
                      <button onClick={handleLogout} className="text-left px-4 py-3 hover:bg-neutral-100 transition">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" className="px-4 py-3 hover:bg-neutral-100 font-semibold transition">Login</Link>
                      <Link to="/auth" className="px-4 py-3 hover:bg-neutral-100 transition">Sign up</Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
