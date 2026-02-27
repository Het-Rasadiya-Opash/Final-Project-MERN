import { useState } from "react";
import apiRequest from "../utils/apiRequest";

interface ReviewFormProps {
  listingId?: string;
}

const ReviewForm = ({ listingId }: ReviewFormProps) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    comment: "",
    rating: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiRequest.post(
        `/review/create/${listingId}`,
        formData,
      );
      setFormData({ comment: "", rating: "" });
    } catch (err: any) {
      setError(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Comment
          </label>
          <textarea
            name="comment"
            id="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your experience..."
            required
          />
        </div>
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Rating (1-5)
          </label>
          <input
            name="rating"
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter rating (1-5)"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
