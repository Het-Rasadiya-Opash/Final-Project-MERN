import { useEffect } from "react";
import apiRequest from "../utils/apiRequest";
interface ReviewProps {
  listingId?: string;
}
const Review = ({ listingId }: ReviewProps) => {
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        // const review = await apiRequest.get(`/review/${listingId}`);
        // console.log(review);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchAllReviews();
  }, []);
  return (
    <>
      <div></div>
    </>
  );
};

export default Review;
