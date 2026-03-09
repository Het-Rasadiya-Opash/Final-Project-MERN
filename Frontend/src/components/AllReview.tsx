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

const AllReview = ({ listingId, refreshTrigger }: ReviewProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const { currentUser } = useAuthStore();

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
        <p className="text-gray-500 py-4">No reviews yet.</p>
      ) : (
        <div className="space-y-6 max-h-125 overflow-y-auto pr-4 scrollbar-hide">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border-b border-gray-100 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg uppercase outline outline-gray-200 outline-offset-2">
                    {review.owner.username.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900 text-[16px]">
                      {review.owner.username}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span>·</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-[15px] ${i < review.rating ? "text-gray-900" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {(currentUser?.admin ||
                  currentUser?._id === review.owner._id) && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-sm text-gray-400 hover:text-red-500 font-medium transition underline"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReview;