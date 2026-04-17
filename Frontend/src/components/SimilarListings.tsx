import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import Listing from "./Listing";

const SimilarListings = ({ listingId }: { listingId: string }) => {
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    apiRequest
      .get(`/listing/${listingId}/similar`)
      .then((res) => setSimilar(res.data.data || []))
      .catch(console.error);
  }, [listingId]);

  if (similar.length === 0) return null;

  return (
    <div className="mt-12 pt-12 border-t border-gray-200">
      <h2 className="text-[22px] font-semibold text-gray-900 mb-6">
        More places to stay
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {similar.map((item) => (
          <Listing key={item._id} listing={item} />
        ))}
      </div>
    </div>
  );
};

export default SimilarListings;
