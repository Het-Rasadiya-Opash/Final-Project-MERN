/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
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
  X,
  ChevronDown,
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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [priceRange, setPriceRange] = useState(() => ({
    min: Math.min(Math.max(minPriceParam, PRICE_MIN), PRICE_MAX),
    max: Math.max(
      Math.min(maxPriceParam, PRICE_MAX),
      Math.min(Math.max(minPriceParam, PRICE_MIN), PRICE_MAX),
    ),
  }));

  const isPriceFiltered =
    priceRange.min > PRICE_MIN || priceRange.max < PRICE_MAX;

  // Close filter panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    const nextMax = Math.max(Math.min(maxPriceParam, PRICE_MAX), nextMin);

    setPriceRange((prev) => {
      if (prev.min === nextMin && prev.max === nextMax) return prev;
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
    if (min > PRICE_MIN) nextParams.set("minPrice", String(min));
    else nextParams.delete("minPrice");
    if (max < PRICE_MAX) nextParams.set("maxPrice", String(max));
    else nextParams.delete("maxPrice");
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
    setShowFilterPanel(false);
  };

  const applyFilter = () => {
    setShowFilterPanel(false);
  };

  const selectedRangeLeft = (priceRange.min / PRICE_MAX) * 100;
  const selectedRangeRight = 100 - (priceRange.max / PRICE_MAX) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Sub-Header */}
      <header className="sticky top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4">

          {/* Mobile search bar */}
          <form onSubmit={handleSearch} className="md:hidden pt-4 pb-2 w-full">
            <div className="flex items-center w-full border border-gray-200 rounded-full py-2.5 px-4 shadow-sm bg-white gap-2">
              <Search className="text-gray-400 shrink-0" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Where to?"
                className="grow text-sm font-medium text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
              />
            </div>
          </form>

          {/* Category bar + Filter button row */}
          <div className="flex items-center gap-3 py-3">
            {/* Scrollable categories */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {/* All Homes */}
              <button
                onClick={() => handleCategoryClick("")}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 group ${
                  selectedCategory === ""
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LayoutGrid
                  size={22}
                  className={`transition-colors ${selectedCategory === "" ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
                />
                <span className="text-xs font-semibold tracking-wide">All Homes</span>
                {selectedCategory === "" && (
                  <span className="block h-0.5 w-full rounded-full bg-gray-900 mt-0.5" />
                )}
              </button>

              {categories.map((item) => {
                const Icon = item.icon;
                const isActive = selectedCategory === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleCategoryClick(item.name)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap shrink-0 transition-all duration-200 group ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={`transition-colors ${isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
                    />
                    <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                    {isActive && (
                      <span className="block h-0.5 w-full rounded-full bg-gray-900 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right controls: Filter + Sort */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Filter popover trigger */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`flex items-center gap-2 border rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isPriceFiltered || showFilterPanel
                      ? "border-gray-900 bg-gray-900 text-white shadow-md"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <SlidersHorizontal size={15} />
                  <span>Filters</span>
                  {isPriceFiltered && (
                    <span className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-900 text-[10px] font-bold">
                      1
                    </span>
                  )}
                </button>

                {/* Filter dropdown panel */}
                {showFilterPanel && (
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900">Price range</h3>
                      <button
                        onClick={() => setShowFilterPanel(false)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-500"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="px-5 py-5">
                      <p className="text-xs text-gray-500 mb-4">Nightly price before fees</p>

                      {/* Min / Max display */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Min</p>
                          <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                            <IndianRupee size={13} />
                            <span>{priceRange.min.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="h-px w-3 bg-gray-300" />
                        <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Max</p>
                          <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                            <IndianRupee size={13} />
                            <span>{priceRange.max.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Range labels */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-2">
                        <span>₹0</span>
                        <span>₹50,000+</span>
                      </div>

                      {/* Dual range slider */}
                      <div className="relative h-8 mb-5">
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

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={resetPriceRange}
                          className="text-sm font-semibold text-gray-600 underline underline-offset-2 hover:text-gray-900 transition"
                        >
                          Clear all
                        </button>
                        <button
                          type="button"
                          onClick={applyFilter}
                          className="flex-1 rounded-xl bg-gray-900 py-2.5 text-sm font-bold text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
                        >
                          Show homes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort by */}
              <div className="relative">
                <select
                  value={sortParam}
                  onChange={handleSortChange}
                  className="appearance-none border border-gray-300 bg-white rounded-full pl-4 pr-8 py-2.5 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-400 hover:shadow-sm cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Active price filter pill */}
      {isPriceFiltered && (
        <div className="max-w-7xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold px-3 py-1.5">
              <IndianRupee size={10} />
              {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()}
              <button
                onClick={resetPriceRange}
                className="ml-1 hover:opacity-70 transition"
              >
                <X size={12} />
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Main listings grid */}
      <main className="max-w-7xl mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-primary" />
              </div>
              <p className="text-sm text-gray-400 font-medium">Finding homes…</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {listings.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                  <Search size={28} className="text-gray-400" />
                </div>
                <p className="text-xl font-bold text-gray-800 mb-1">No exact matches</p>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  Try adjusting or removing your filters to find something great.
                </p>
                {(isPriceFiltered || selectedCategory) && (
                  <button
                    onClick={() => {
                      resetPriceRange();
                      setSelectedCategory("");
                    }}
                    className="mt-5 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              listings.map((listing: any) => (
                <Listing key={listing._id} listing={listing} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
