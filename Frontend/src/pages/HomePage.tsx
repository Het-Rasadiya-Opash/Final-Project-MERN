/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiRequest from "../utils/apiRequest";
import Listing from "../components/Listing";
import {
  Bed,
  Palmtree,
  Warehouse,
  Flame,
  Building2,
  Tractor,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  IndianRupee,
} from "lucide-react";

const PRICE_MIN = 0;
const PRICE_MAX = 50000;
const PRICE_STEP = 500;

const categories = [
  { name: "rooms", icon: Bed, label: "Rooms" },
  { name: "beachfront", icon: Palmtree, label: "Beachfront" },
  { name: "cabins", icon: Warehouse, label: "Cabins" },
  { name: "trending", icon: Flame, label: "Trending" },
  { name: "city", icon: Building2, label: "Top cities" },
  { name: "countryside", icon: Tractor, label: "Countryside" },
];

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sortBy") || "newest";
  const minPriceParam = Number(searchParams.get("minPrice") || PRICE_MIN);
  const maxPriceParam = Number(searchParams.get("maxPrice") || PRICE_MAX);
  const [search, setSearch] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState(() => ({
    min: Math.min(Math.max(minPriceParam, PRICE_MIN), PRICE_MAX),
    max: Math.max(
      Math.min(maxPriceParam, PRICE_MAX),
      Math.min(Math.max(minPriceParam, PRICE_MIN), PRICE_MAX),
    ),
  }));

  const fetchListings = async (
    category = "",
    searchQuery = "",
    sortBy = "newest",
    minPrice = PRICE_MIN,
    maxPrice = PRICE_MAX,
  ) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (category) queryParams.append("category", category);
      if (searchQuery) queryParams.append("search", searchQuery);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (minPrice > PRICE_MIN) queryParams.append("minPrice", String(minPrice));
      if (maxPrice < PRICE_MAX) queryParams.append("maxPrice", String(maxPrice));
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await apiRequest.get(`/listing${query}`);
      setListings(res.data.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(
      selectedCategory,
      searchParam,
      sortParam,
      priceRange.min,
      priceRange.max,
    );
  }, [selectedCategory, searchParam, sortParam, priceRange.min, priceRange.max]);

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const nextMin = Math.min(Math.max(minPriceParam, PRICE_MIN), PRICE_MAX);
    const nextMax = Math.max(
      Math.min(maxPriceParam, PRICE_MAX),
      nextMin,
    );

    setPriceRange((prev) => {
      if (prev.min === nextMin && prev.max === nextMax) {
        return prev;
      }

      return { min: nextMin, max: nextMax };
    });
  }, [minPriceParam, maxPriceParam]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({
        search: search.trim(),
        ...(sortParam ? { sortBy: sortParam } : {}),
      });
    } else {
      setSearchParams(sortParam ? { sortBy: sortParam } : {});
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSort = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sortBy", nextSort);
    setSearchParams(nextParams);
  };

  const updatePriceParams = (min: number, max: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (min > PRICE_MIN) {
      nextParams.set("minPrice", String(min));
    } else {
      nextParams.delete("minPrice");
    }

    if (max < PRICE_MAX) {
      nextParams.set("maxPrice", String(max));
    } else {
      nextParams.delete("maxPrice");
    }

    setSearchParams(nextParams);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = Math.min(Number(e.target.value), priceRange.max - PRICE_STEP);
    updatePriceParams(nextMin, priceRange.max);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = Math.max(Number(e.target.value), priceRange.min + PRICE_STEP);
    updatePriceParams(priceRange.min, nextMax);
  };

  const resetPriceRange = () => {
    updatePriceParams(PRICE_MIN, PRICE_MAX);
  };

  const selectedRangeLeft = (priceRange.min / PRICE_MAX) * 100;
  const selectedRangeRight = 100 - (priceRange.max / PRICE_MAX) * 100;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-20 z-40 bg-white border-b border-gray-100 shadow-sm mt-4">
        <div className="max-w-7xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-4">
          
          <form onSubmit={handleSearch} className="md:hidden flex justify-center mb-6 w-full">
            <div className="flex items-center w-full max-w-full border border-gray-300 rounded-full py-2 px-4 shadow-md bg-white">
              <Search className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where to?"
                className="grow text-md font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-500"
              />
            </div>
          </form>

          <div className="flex flex-col gap-4 lg:gap-5">
            <div className="flex items-center justify-end px-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Sort by</span>
                <select
                  value={sortParam}
                  onChange={handleSortChange}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 outline-none transition focus:border-gray-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
              </label>
            </div>

            <div className="px-2">
              <div className="rounded-[28px] border border-gray-200 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] lg:px-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <SlidersHorizontal size={16} />
                        Price range
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Narrow stays by nightly budget.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start lg:self-auto">
                      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Min
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-base font-semibold text-gray-900">
                            <IndianRupee size={14} />
                            <span>{priceRange.min.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-gray-200" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Max
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-base font-semibold text-gray-900">
                            <IndianRupee size={14} />
                            <span>{priceRange.max.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={resetPriceRange}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-5">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                      <span>₹0</span>
                      <span>₹50,000+</span>
                    </div>

                    <div className="relative mt-4 h-8">
                      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />
                      <div
                        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-900"
                        style={{
                          left: `${selectedRangeLeft}%`,
                          right: `${selectedRangeRight}%`,
                        }}
                      />

                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={priceRange.min}
                        onChange={handleMinPriceChange}
                        className="price-slider pointer-events-none absolute inset-0 z-20 h-8 w-full appearance-none bg-transparent"
                      />
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={priceRange.max}
                        onChange={handleMaxPriceChange}
                        className="price-slider absolute inset-0 z-10 h-8 w-full appearance-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between lg:justify-start overflow-x-auto gap-10 scrollbar-hide px-2">
            <button
              onClick={() => handleCategoryClick("")}
              className={`flex flex-col items-center justify-center gap-2 pb-3 border-b-2 hover:text-black transition cursor-pointer min-w-max ${
                selectedCategory === "" ? "border-black text-black" : "border-transparent text-gray-500"
              }`}
            >
              <LayoutGrid size={24} />
              <span className="text-sm font-medium">All Homes</span>
            </button>

            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleCategoryClick(item.name)}
                  className={`flex flex-col items-center justify-center gap-2 pb-3 border-b-2 hover:text-black transition cursor-pointer min-w-max ${
                    selectedCategory === item.name ? "border-black text-black" : "border-transparent text-gray-500"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {listings.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-2xl font-semibold text-gray-800 mb-2">No exact matches</p>
                <p className="font-light text-gray-600">Try changing or removing some of your filters.</p>
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
