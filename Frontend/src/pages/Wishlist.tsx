import { useEffect, useState } from 'react'
import useAuthStore from '../utils/authStore'
import apiRequest from '../utils/apiRequest';
import Listing from '../components/Listing';
import { Heart } from 'lucide-react';

const Wishlist = () => {

    const { currentUser } = useAuthStore();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;
        const fetchWishlist = async () => {
            try {
                const response = await apiRequest.get(`/like/user?userId=${currentUser._id}`);
                setWishlist(response.data);
               
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchWishlist();
    }, [currentUser])


    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 text-lg">Please log in to view your wishlist</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-630 mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="text-rose-500 fill-rose-500" size={28} />
                    <h1 className="text-2xl font-semibold text-gray-900">Wishlist</h1>
                    {!loading && <span className="text-sm text-gray-500">({wishlist.length})</span>}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart size={80} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-600 text-xl font-light mb-2">Your wishlist is empty</p>
                        <p className="text-gray-400 text-sm">Click the heart on listings to save your favorites</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                        {wishlist.map((item: any) => (
                            item.listing && <Listing key={item._id} listing={item.listing} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
