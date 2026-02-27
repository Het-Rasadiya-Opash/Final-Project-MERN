import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import useAuthStore from "../utils/authStore";

interface ReviewProps {
  listingId?: string;
  refreshTrigger?: number;
}

interface ReviewData {
  _id: string;
  comment: string;
  rating: number;
  owner: {
    username: string;
    _id: string;
  };
  createdAt: string;
}

const Review = ({ listingId, refreshTrigger }: ReviewProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const { currentUser } = useAuthStore();
  console.log(currentUser?._id);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiRequest.get(`/review/${listingId}`);
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [listingId, refreshTrigger]);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await apiRequest.delete(`/review/delete/${listingId}`, {
        data: { reviewId },
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reviews yet</p>
      ) : (
        <div
          className="space-y-4 max-h-125 overflow-y-auto pr-2"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e0 #f7fafc" }}
        >
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.owner.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.owner.username}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              {currentUser?._id === review.owner._id && (
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
