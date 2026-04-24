import { useMemo, useState } from 'react';
import axios from 'axios';

const CITY_OPTIONS = [
  'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Bhopal', 'Patna', 'Chandigarh', 'Surat',
  'Nagpur', 'Kanpur', 'Indore', 'Varanasi', 'Amritsar', 'Goa', 'Secunderabad', 
  'Thane','Visakhapatnam', 'Coimbatore', 'Agra', 'Madurai', 'Nashik', 'Vadodara', 
  'Ghaziabad', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 
  'Srinagar', 'Aurangabad', 'Dhanbad', 'Amravati', 'Navi Mumbai', 'Allahabad', 
  'Ranchi', 'Howrah', 'Jabalpur', 'Gwalior', 'Dehradun','Danapur', 'Asansol', 
  'Kolhapur', 'Ajmer', 'Gorakhpur', 'Jodhpur', 'Ujjain', 'Solapur', 'Tiruchirappalli', 
  'Mysore', 'Hubli-Dharwad', 'Tiruppur', 'Guntur', 'Bhubaneswar', 'Aligarh', 'Moradabad', 
  'Jalandhar', 'Bhiwandi', 'Saharanpur', 'Varansi', 'Gaya', 'Jalgaon', 'Durgapur', 'Nellore', 
  'Jammu', 'Belgaum', 'Mangalore', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gulbarga', 'Udaipur', 
  'Ludhiana', 'Bilaspur', 'Rourkela', 'Bardhaman', 'Yamunanagar', 'Kurnool', 'Silchar', 
  'Kakinada', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Nanded', 'Jamshedpur', 'Muzaffarpur', 
  'Mathura', 'Panipat', 'Loni', 'Kharagpur', 'Tirupati', 'Deoghar', 'Vizag', 'Ratlam', 
  'Anantapur', 'Bhatpara', 'Panvel', 'Gulbarga', 'Udaipur', 'Ludhiana', 'Bilaspur', 'Rourkela', 
  'Bardhaman', 'Yamunanagar', 'Kurnool', 'Silchar'
];

const TRAIN_CLASSES = ['2S', 'SL', '3AC', '2AC', '1AC'];
const CLASS_PRICE_ADDON = {
  '2S': 0,
  SL: 140,
  '3AC': 360,
  '2AC': 700,
  '1AC': 1200
};

const formatTime = (value) => {
  if (!value) return 'N/A';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const TrainBooking = () => {
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [trainResults, setTrainResults] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phone: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({ from: false, to: false });
  const [selectedClasses, setSelectedClasses] = useState({});

  const isSearchDisabled = useMemo(() => {
    return !searchForm.from || !searchForm.to || !searchForm.date || isSearching;
  }, [searchForm]);

  const fromSuggestions = useMemo(() => {
    const value = searchForm.from.trim().toLowerCase();
    if (!value) return CITY_OPTIONS.slice(0, 6);

    return CITY_OPTIONS.filter((city) => city.toLowerCase().includes(value)).slice(0, 6);
  }, [searchForm.from]);

  const toSuggestions = useMemo(() => {
    const value = searchForm.to.trim().toLowerCase();
    if (!value) return CITY_OPTIONS.slice(0, 6);

    return CITY_OPTIONS.filter((city) => city.toLowerCase().includes(value)).slice(0, 6);
  }, [searchForm.to]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuggestionClick = (field, value) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  };

  const handleBookingChange = (e) => {
    setBookingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearchTrains = async (e) => {
    e.preventDefault();
    if (isSearchDisabled) {
      alert('Please complete all fields with valid values.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setHasSearched(true);
    try {
      const res = await axios.get('/api/trains/search', {
        params: {
          from: searchForm.from,
          to: searchForm.to,
          date: searchForm.date
        }
      });

      const results = res.data?.trains || [];
      setTrainResults(results);
      const nextSelectedClasses = {};
      results.forEach((train) => {
        nextSelectedClasses[train.id] = selectedClasses[train.id] || '3AC';
      });
      setSelectedClasses(nextSelectedClasses);
    } catch (error) {
      setTrainResults([]);
      setSearchError(error.response?.data?.message || 'Unable to fetch trains right now.');
    }
    setIsSearching(false);
  };

  const handleClassSelect = (trainId, cls) => {
    setSelectedClasses((prev) => ({
      ...prev,
      [trainId]: cls
    }));
  };

  const getPriceByClass = (basePrice, cls) => {
    const addon = CLASS_PRICE_ADDON[cls] || 0;
    return Number(basePrice || 0) + addon;
  };

  const openBookingModal = (train) => {
    const selectedClass = selectedClasses[train.id] || '3AC';
    setSelectedTrain({
      ...train,
      selectedClass,
      selectedPrice: getPriceByClass(train.price, selectedClass)
    });
    setModalOpen(true);
  };

  const closeBookingModal = () => {
    setModalOpen(false);
    setSelectedTrain(null);
    setBookingForm({
      fullName: '',
      phone: '',
      email: ''
    });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!selectedTrain) return;

    setIsSaving(true);
    try {
      await axios.post('/api/bookings/create', {
        type: 'train',
        trainName: selectedTrain.name,
        from: searchForm.from,
        to: searchForm.to,
        date: searchForm.date,
        passengers: 1,
        class: selectedTrain.selectedClass,
        fullName: bookingForm.fullName,
        phone: bookingForm.phone,
        email: bookingForm.email,
        paymentMethod: 'Online'
      });
      alert('Train booking saved successfully.');
      closeBookingModal();
    } catch (error) {
      alert('Error saving train booking. Please try again.');
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Train Ticket Booking</h1>
          <p className="text-gray-600 mt-2">Search available trains with live public data and complete your booking.</p>

          <form onSubmit={handleSearchTrains} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From (city)</label>
              <input
                id="from"
                name="from"
                type="text"
                value={searchForm.from}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions((prev) => ({ ...prev, from: true }))}
                onBlur={() => setTimeout(() => setShowSuggestions((prev) => ({ ...prev, from: false })), 120)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Delhi"
                required
              />
              {showSuggestions.from && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-44 overflow-auto">
                  {fromSuggestions.map((city) => (
                    <button
                      key={`from-${city}`}
                      type="button"
                      onMouseDown={() => handleSuggestionClick('from', city)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-700"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To (city)</label>
              <input
                id="to"
                name="to"
                type="text"
                value={searchForm.to}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions((prev) => ({ ...prev, to: true }))}
                onBlur={() => setTimeout(() => setShowSuggestions((prev) => ({ ...prev, to: false })), 120)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Mumbai"
                required
              />
              {showSuggestions.to && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-44 overflow-auto">
                  {toSuggestions.map((city) => (
                    <button
                      key={`to-${city}`}
                      type="button"
                      onMouseDown={() => handleSuggestionClick('to', city)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-gray-700"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={searchForm.date}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                disabled={isSearchDisabled}
              >
                {isSearching && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isSearching ? 'Searching...' : 'Search Trains'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainResults.map((train) => (
            <div key={train.id} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{train.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {searchForm.from} to {searchForm.to} on {new Date(searchForm.date).toLocaleDateString()}
              </p>
              <div className="mt-4 space-y-1 text-gray-700">
                <p><span className="font-semibold">Departure:</span> {formatTime(train.departureTime)}</p>
                <p><span className="font-semibold">Arrival:</span> {formatTime(train.arrivalTime)}</p>
                <p>
                  <span className="font-semibold">Price:</span> Rs. {getPriceByClass(train.price, selectedClasses[train.id] || '3AC')}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Available Classes</p>
                <div className="flex flex-wrap gap-2">
                  {TRAIN_CLASSES.map((cls) => {
                    const isSelected = (selectedClasses[train.id] || '3AC') === cls;
                    return (
                      <button
                        key={`${train.id}-${cls}`}
                        type="button"
                        onClick={() => handleClassSelect(train.id, cls)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => openBookingModal(train)}
                className="mt-5 w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>

        {hasSearched && !isSearching && trainResults.length === 0 && !searchError && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-600">
            No trains found
          </div>
        )}

        {searchError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl shadow-sm p-6 text-red-700">
            {searchError}
          </div>
        )}

        {!hasSearched && !isSearching && trainResults.length === 0 && !searchError && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-600">
            Search trains to view available options.
          </div>
        )}
      </div>

      {modalOpen && selectedTrain && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900">Book {selectedTrain.name}</h3>
            <p className="text-sm text-gray-600 mt-1">Class: {selectedTrain.selectedClass}</p>
            <p className="text-sm text-gray-600 mt-1">Fare: Rs. {selectedTrain.selectedPrice}</p>
            <p className="text-sm text-gray-600 mt-1">Fill in your contact details to confirm booking.</p>

            <form onSubmit={handleConfirmBooking} className="mt-5 space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={bookingForm.fullName}
                  onChange={handleBookingChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={bookingForm.phone}
                  onChange={handleBookingChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={bookingForm.email}
                  onChange={handleBookingChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainBooking;
