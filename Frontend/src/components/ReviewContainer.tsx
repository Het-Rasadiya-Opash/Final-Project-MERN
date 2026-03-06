import { useState } from 'react'
import ReviewForm from './ReviewForm'
import useAuthStore from '../utils/authStore';
import AllReview from './AllReview';

const ReviewContainer = ({ id }: { id: string }) => {
    const { currentUser } = useAuthStore();
    const [reviewRefresh, setReviewRefresh] = useState(0);

    return (
        <>
            <div className="mt-16 pt-10 border-t">
                <h2 className="text-2xl font-bold mb-8">
                    Reviews
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {currentUser && (
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">
                                Leave a Review
                            </h3>
                            <ReviewForm
                                listingId={id}
                                onReviewAdded={() =>
                                    setReviewRefresh((prev) => prev + 1)
                                }
                            />
                        </div>
                    )}

                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">
                            All Reviews
                        </h3>
                        <AllReview
                            listingId={id}
                            refreshTrigger={reviewRefresh}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewContainer
