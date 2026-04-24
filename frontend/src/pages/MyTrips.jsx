import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get('/api/trips');
        setTrips(res.data);
      } catch (error) {
        alert('Error fetching trips');
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Trips</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              onClick={() => navigate(`/itinerary/${trip._id}`)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img src={trip.cityImage} alt={trip.city} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold">{trip.city}</h2>
                <p className="text-gray-600">{trip.days} days</p>
                <p className="text-gray-600">{trip.budget} budget</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;