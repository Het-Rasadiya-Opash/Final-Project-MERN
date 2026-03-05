import React, { useEffect, useState } from 'react'
import apiRequest from '../utils/apiRequest'
import { Calendar, User, MapPin, Users } from 'lucide-react'

const ListingOwnerBooking = () => {

    const [listingBooking, setListingBooking] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllBookingByOnwer = async () => {
            try {
                const response = await apiRequest.get('/booking/all');
                console.log(response.data)
                setListingBooking(response.data)
            } catch (error) {
                console.error('Failed to fetch bookings:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllBookingByOnwer();
    }, [])

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Listing Bookings</h2>
            
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : listingBooking.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No bookings found</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {listingBooking.map((booking: any) => (
                        <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Listing Image */}
                                <div className="w-full lg:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={booking.listing?.images?.[0] || '/placeholder.jpg'}
                                        alt={booking.listing?.title || 'Listing'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Listing Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.listing?.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                <MapPin size={16} />
                                                <span className="text-sm">{booking.listing?.location}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                            booking.isPaid ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                            'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {booking.isPaid ? 'Paid' : booking.status}
                                        </span>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User size={18} className="text-gray-600" />
                                            <span className="font-semibold text-gray-900">Customer Details</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <p className="text-gray-700">
                                                <span className="font-medium">Name:</span> {booking.customer?.username || 'N/A'}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-medium">Email:</span> {booking.customer?.email || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 mb-1">Check-in</p>
                                            <p className="font-semibold text-gray-900">{new Date(booking.checkIn).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Check-out</p>
                                            <p className="font-semibold text-gray-900">{new Date(booking.checkOut).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Guests</p>
                                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                <Users size={16} />
                                                {booking.guests}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Total Price</p>
                                            <p className="font-bold text-lg text-gray-900">₹{booking.totalPrice?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ListingOwnerBooking
