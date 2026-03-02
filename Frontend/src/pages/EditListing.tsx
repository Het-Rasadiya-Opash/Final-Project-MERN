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
          coordinates: listing.geometry?.coordinates || [0, 0],
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
    data.append("coordinates", JSON.stringify(formData.coordinates));

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
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Edit Listing</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {existingImages.length > 0 || imagePreviews.length > 0 ? (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Images Preview
            </label>

            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, index) => (
                <div key={`existing-${index}`} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative">
                  <img
                    src={preview}
                    alt="new-preview"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500"
                  />

                  <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1 rounded">
                    New
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Images (optional)
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {images.length} new image(s) selected
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Price *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Coordinates (Latitude, Longitude)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={formData.coordinates[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coordinates: [Number(e.target.value), formData.coordinates[1]],
                })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={formData.coordinates[1]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coordinates: [formData.coordinates[0], Number(e.target.value)],
                })
              }
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg transition duration-200 font-medium"
        >
          {loading ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
};

export default EditListing;
