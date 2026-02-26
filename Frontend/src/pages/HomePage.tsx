import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import Listing from "../components/Listing";

const categories = ["rooms", "beachfront", "cabins", "trending", "city", "countryside"];

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchListings = async (category = "") => {
    setLoading(true);
    try {
      const query = category ? `?category=${category}` : "";
      const res = await apiRequest.get(`/listing${query}`);
      setListings(res.data.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    fetchListings(category);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest.get(`/listing?search=${search}`);
      setListings(res.data.data);
      setSelectedCategory("");
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or location..."
              className="w-full sm:flex-1 px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base font-medium"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategoryClick("")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition duration-200 text-sm sm:text-base ${
              selectedCategory === "" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap capitalize transition duration-200 text-sm sm:text-base ${
                selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {listings.map((listing: any) => (
              <Listing key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
