import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    city: '',
    days: '',
    budget: '',
    travelerType: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBudgetSelect = (budget) => {
    setFormData({ ...formData, budget });
  };

  const handleTravelerSelect = (travelerType) => {
    setFormData({ ...formData, travelerType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.city || !formData.days || !formData.budget || !formData.travelerType) {
      alert('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const tripData = {
        city: formData.city,
        days: parseInt(formData.days),
        budget: formData.budget,
        travelers: formData.travelerType === 'Just Me' ? 1 : formData.travelerType === 'A Couple' ? 2 : formData.travelerType === 'Family' ? 4 : 3
      };
      const res = await axios.post('/api/trips/generate', tripData);
      navigate(`/itinerary/${res.data._id}`);
    } catch (error) {
      alert('Error generating trip');
    }
    setLoading(false);
  };

  const budgetOptions = [
    { value: 'Cheap', icon: '💰', description: 'Budget-friendly options' },
    { value: 'Moderate', icon: '💵', description: 'Balanced comfort' },
    { value: 'Luxury', icon: '💎', description: 'Premium experiences' }
  ];

  const travelerOptions = [
    { value: 'Just Me', icon: '👨', description: 'Solo traveler' },
    { value: 'A Couple', icon: '🥂', description: 'Romantic getaway' },
    { value: 'Family', icon: '🏡', description: 'Family vacation' },
    { value: 'Friends', icon: '🎉', description: 'Group adventure' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Tell us your travel preferences ✈️
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              What is destination of choice?
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* Days */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              How many days are you planning your trip?
            </label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              placeholder="Ex.3"
              min="1"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* Budget */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              What is your Budget?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleBudgetSelect(option.value)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                    formData.budget === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{option.value}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Traveler Type */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Who do you plan on traveling with on your next adventure?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {travelerOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleTravelerSelect(option.value)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                    formData.travelerType === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{option.value}</h3>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Generating...' : 'Generate Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;