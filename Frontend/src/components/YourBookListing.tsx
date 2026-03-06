import  { useEffect, useState } from 'react'
import apiRequest from '../utils/apiRequest';
import { Calendar, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import AlertModal from './AlertModal';

const YourBookListing = () => {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<any>([]);
    const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean, bookingId: string }>({ isOpen: false, bookingId: '' });
    const [alert, setAlert] = useState<{ isOpen: boolean, title: string, message: string, type?: 'success' | 'error' | 'warning' }>({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        const fetchUserBooking = async () => {
            try {
                const res = await apiRequest.get(`/booking/user`);
                setBookings(res.data);
            } catch (error) {
                console.log("Failed to fetch bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserBooking();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const success = params.get('success');
        const bookingId = params.get('bookingId');

        if (success === 'true' && bookingId) {
            apiRequest.put('/booking/payment', { bookingId })
                .then(() => {
                    window.history.replaceState({}, '', '/profile');
                    window.location.reload();
                })
                .catch(err => console.error('Payment update failed:', err));
        }
    }, []);

    const handleCheckout = async (booking: any) => {
        try {
            const response = await apiRequest.post(`/payment/create-checkout-session`, {
                listing: booking.listing,
                bookingId: booking._id,
                stayDay: booking.stayDay
            })
            window.location.href = response.data.url
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteBooking = async (bookingId: string) => {
        try {
            await apiRequest.delete(`/booking/delete`, {
                data: { bookingId }
            });
            setBookings(bookings.filter((b: any) => b._id !== bookingId));
            setAlert({ isOpen: true, title: 'Success', message: 'Booking deleted successfully', type: 'success' });
        } catch (error) {
            console.error("Error deleting booking:", error);
            setAlert({ isOpen: true, title: 'Error', message: 'Failed to delete booking', type: 'error' });
        }
        setConfirmDelete({ isOpen: false, bookingId: '' });
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 p-2.5 rounded-xl shadow-sm border border-blue-100">
                    <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
                    <p className="text-sm text-gray-500">Total: {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No bookings yet</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking: any) => (
                        <div key={booking._id} className="border border-gray-100 rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow bg-white">
                            <div className="flex flex-col md:flex-row items-center gap-6">

                                <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 shadow-sm">
                                    <img
                                        src={booking.listing?.images?.[0] || '/placeholder.jpg'}
                                        alt={booking.listing?.title || 'Listing'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-slate-800 mb-0.5">{booking.listing?.title || 'Listing'}</h3>
                                    <p className="text-sm text-gray-400 mb-3">{booking.listing?.location}</p>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-slate-600 font-medium">
                                        <span>Check-in: {new Date(booking.checkIn).toLocaleDateString("en-GB")}</span>
                                        <span className="hidden md:inline border-l border-gray-300 h-4"></span>
                                        <span>Check-out: {new Date(booking.checkOut).toLocaleDateString("en-GB")}</span>
                                        <span className="hidden md:inline border-l border-gray-300 h-4"></span>
                                        <span>Guests: {booking.guests}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-2 md:border-l md:border-gray-100 md:pl-6 w-full md:w-auto">
                                    <div className="text-center md:text-right">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Price</p>
                                        <p className="text-2xl font-black text-slate-900 leading-none">
                                            ₹{booking.totalPrice?.toLocaleString()}
                                        </p>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm border ${booking.isPaid ? 'bg-blue-600 text-white border-blue-700' :
                                        booking.status === 'confirmed' ? 'bg-emerald-600 text-white border-emerald-700' :
                                            booking.status === 'pending' ? 'bg-amber-500 text-white border-amber-600' :
                                                'bg-rose-600 text-white border-rose-700'
                                        }`}>
                                        {booking.isPaid ? 'Paid' : booking.status || 'Pending'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {booking.status === "pending" && (
                                        <button
                                            onClick={() => setConfirmDelete({ isOpen: true, bookingId: booking._id })}
                                            className="flex-1 md:flex-none p-2.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5 mx-auto" />
                                        </button>
                                    )}

                                    {booking.status === 'confirmed' && !booking.isPaid && (
                                        <button
                                            onClick={() => handleCheckout(booking)}
                                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 uppercase text-sm tracking-wide"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}
            
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, bookingId: '' })}
                onConfirm={() => handleDeleteBooking(confirmDelete.bookingId)}
                title="Delete Booking"
                message="Are you sure you want to delete this booking? This action cannot be undone."
            />
            
            <AlertModal
                isOpen={alert.isOpen}
                onClose={() => setAlert({ ...alert, isOpen: false })}
                title={alert.title}
                message={alert.message}
                type={alert.type}
            />
        </div>
    )
}

export default YourBookListing
