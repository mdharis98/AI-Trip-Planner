import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookingModal from '../components/BookingModal';

const Itinerary = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await axios.get(`/api/trips/${id}`);
        setTrip(res.data);
      } catch (error) {
        alert('Error fetching trip');
      }
    };
    fetchTrip();
  }, [id]);

  const handleConfirm = async (data) => {
    try {
      await axios.post('/api/bookings/create', { hotelName: selectedHotel, ...data });
      alert('Your booking is confirmed. Please pay at the hotel.');
      setModalOpen(false);
    } catch (error) {
      alert('Error booking hotel');
    }
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Trip to {trip.city}</h1>

        {/* Itinerary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
          {trip.itinerary.map((day) => (
            <div key={day.day} className="mb-4">
              <h3 className="text-xl font-semibold">Day {day.day}</h3>
              <ul className="list-disc list-inside">
                {day.activities.map((activity, idx) => (
                  <li key={idx}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hotels */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recommended Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trip.hotels.map((hotel, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-bold">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.address}</p>
                <p className="text-gray-600">{hotel.priceRange}</p>
                <p className="text-yellow-500">Rating: {Number(hotel.rating).toFixed(1)}/5</p>
                <button
                  onClick={() => { setSelectedHotel(hotel.name); setModalOpen(true); }}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Book Hotel
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {modalOpen && (
        <BookingModal
          hotelName={selectedHotel}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default Itinerary;