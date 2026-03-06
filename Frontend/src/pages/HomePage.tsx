import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import Listing from "../components/Listing";
import {
  Bed,
  Palmtree,
  Warehouse,
  Flame,
  Building2,
  Tractor,
  LayoutGrid
} from "lucide-react";

const categories = [
  { name: "rooms", icon: Bed },
  { name: "beachfront", icon: Palmtree },
  { name: "cabins", icon: Warehouse },
  { name: "trending", icon: Flame },
  { name: "city", icon: Building2 },
  { name: "countryside", icon: Tractor },
];

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
            console.log(res.data.data)

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
    <div className="min-h-screen bg-white">
      <header className="sticky top-20 z-40 bg-white border-b border-gray-200 pt-4 pb-2">
        <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
          <form onSubmit={handleSearch} className="flex justify-center mb-4">
            <div className="flex items-center w-full max-w-md border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="grow text-sm font-semibold bg-transparent focus:outline-none"
              />
              <button type="submit" className="bg-blue-500 p-2 rounded-full text-white">
                <svg viewBox="0 0 32 32" className="block fill-none h-3 w-3 stroke-current stroke-[4px]" aria-hidden="true">
                  <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9"></path>
                </svg>
              </button>
            </div>
          </form>

          <div className="flex flex-row items-center justify-between overflow-x-auto gap-8 scrollbar-hide">
            <button
              onClick={() => handleCategoryClick("")}
              className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${selectedCategory === "" ? "border-black text-black" : "border-transparent text-neutral-500"
                }`}
            >
              <LayoutGrid size={24} />
              <span className="text-xs font-medium">All</span>
            </button>

            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleCategoryClick(item.name)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer whitespace-nowrap ${selectedCategory === item.name ? "border-black text-black" : "border-transparent text-neutral-500"
                    }`}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium capitalize">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {listings.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500">
                <p className="text-xl font-semibold">No exact matches</p>
                <p className="font-light">Try changing or removing some of your filters.</p>
              </div>
            ) : (
              listings.map((listing: any) => <Listing key={listing._id} listing={listing} />)
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
