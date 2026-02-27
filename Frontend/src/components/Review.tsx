import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";

interface ReviewProps {
  listingId?: string;
}

interface ReviewData {
  _id: string;
  comment: string;
  rating: number;
  owner: {
    username: string;
  };
  createdAt: string;
}

const Review = ({ listingId }: ReviewProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiRequest.get(`/listing/review/${listingId}`);
        setReviews(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.owner.username}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
