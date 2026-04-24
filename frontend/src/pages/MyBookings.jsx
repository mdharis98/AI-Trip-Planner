import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/bookings/user/${user._id}`);
        setBookings(res.data);
      } catch (error) {
        alert('Error fetching bookings');
      }
    };
    if (user) fetchBookings();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-lg p-6">
              {booking.type === 'train' || booking.type === 'bus' || booking.type === 'flight' ? (
                <>
                  <h2 className="text-xl font-bold">
                    {booking.type === 'bus' ? 'Bus Ticket' : booking.type === 'flight' ? 'Flight Ticket' : 'Train Ticket'}
                  </h2>
                  {booking.type === 'train' && booking.trainName && (
                    <p className="text-gray-600">Train: {booking.trainName}</p>
                  )}
                  <p className="text-gray-600">Route: {booking.from} to {booking.to}</p>
                  <p className="text-gray-600">Travel Date: {new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Passengers: {booking.passengers}</p>
                  {(booking.type === 'flight' || booking.type === 'train') && booking.class && (
                    <p className="text-gray-600">Class: {booking.class}</p>
                  )}
                  <p className="text-gray-600">Name: {booking.fullName}</p>
                  <p className="text-gray-600">Phone: {booking.phone}</p>
                  <p className="text-gray-600">Email: {booking.email}</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{booking.hotelName}</h2>
                  <p className="text-gray-600">Full Name: {booking.fullName}</p>
                  <p className="text-gray-600">Phone: {booking.phone}</p>
                  <p className="text-gray-600">Email: {booking.email}</p>
                  <p className="text-gray-600">Guests: {booking.guests}</p>
                  <p className="text-gray-600">Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p className="text-gray-600">Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                  <p className="text-gray-600">Payment: {booking.paymentMethod}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;