import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiRequest from "../utils/apiRequest";

const categories = [
  "rooms",
  "beachfront",
  "cabins",
  "trending",
  "city",
  "countryside",
];

const EditListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "rooms",
    location: "",
    coordinates: [0, 0] as [number, number],
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await apiRequest.get(`/listing/${listingId}`);
        const listing = response.data.data;
        setFormData({
          title: listing.title,
          description: listing.description || "",
          price: listing.price,
          category: listing.category,
          location: listing.location,
          coordinates: listing.geometry?.coordinates && Array.isArray(listing.geometry.coordinates) && listing.geometry.coordinates.length === 2 
            ? [Number(listing.geometry.coordinates[0]) || 0, Number(listing.geometry.coordinates[1]) || 0]
            : [0, 0],
        });
        setExistingImages(listing.images || []);
      } catch (err) {
        setError("Failed to load listing");
      }
    };
    fetchListing();
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("coordinates", JSON.stringify(formData.coordinates));
    images.forEach((image) => data.append("images", image));

    try {
      await apiRequest.put(`/listing/${listingId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/listing/${listingId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(filePreviews);
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      await apiRequest.delete(`/listing/${listingId}/image`, {
        data: { imageUrl },
      });

      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    } catch (err:any) {
      setError(err.response?.data?.message);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

 return (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Edit Listing
      </h1>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {(existingImages.length > 0 || imagePreviews.length > 0) && (
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              Images Preview
            </label>

            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={img}
                    alt="preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt="new-preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border-2 border-blue-500 shadow-sm"
                  />

                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1 rounded">
                    New
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Add More Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {images.length} new image(s) selected
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 space-y-4">
          <label className="block text-gray-700 font-medium">
            Coordinates
          </label>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={formData.coordinates[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coordinates: [
                    Number(e.target.value),
                    formData.coordinates[1],
                  ],
                })
              }
              className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={formData.coordinates[1]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coordinates: [
                    formData.coordinates[0],
                    Number(e.target.value),
                  ],
                })
              }
              className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? "Updating..." : "Update Listing"}
        </button>

      </form>
    </div>
  </div>
);
};

export default EditListing;
