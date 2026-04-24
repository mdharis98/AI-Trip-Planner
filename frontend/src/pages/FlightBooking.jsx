import { useMemo, useState } from 'react';
import axios from 'axios';

const AIRLINES = [
  'IndiGo',
  'Air India',
  'Vistara',
  'SpiceJet',
  'Akasa Air',
  'Air India Express'
];

const formatAmPm = (dateTime) => {
  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) return 'N/A';

  return parsed.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const createMockFlights = ({ from, to, date, passengers, flightClass }) => {
  const seed = `${from}${to}${date}${passengers}${flightClass}`
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return AIRLINES.slice(0, 5).map((airline, index) => {
    const depHour = 5 + ((seed + index * 2) % 16);
    const depMinute = (seed + index * 11) % 60;
    const durationMinutes = 70 + ((seed + index * 37) % 210);
    const arrMinutes = depHour * 60 + depMinute + durationMinutes;
    const arrHour = Math.floor((arrMinutes % (24 * 60)) / 60);
    const arrMinute = arrMinutes % 60;

    const basePrice = 2800 + ((seed + index * 169) % 8200);
    const classMultiplier = flightClass === 'Business' ? 1.75 : 1;

    return {
      id: `FL-${index + 1}`,
      airline,
      departureTime: `${date}T${String(depHour).padStart(2, '0')}:${String(depMinute).padStart(2, '0')}:00.000Z`,
      arrivalTime: `${date}T${String(arrHour).padStart(2, '0')}:${String(arrMinute).padStart(2, '0')}:00.000Z`,
      duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
      price: Math.round(basePrice * classMultiplier)
    };
  });
};

const FlightBooking = () => {
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    flightClass: 'Economy'
  });
  const [flightResults, setFlightResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phone: '',
    email: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const isSearchDisabled = useMemo(() => {
    return (
      !searchForm.from ||
      !searchForm.to ||
      !searchForm.date ||
      Number(searchForm.passengers) < 1 ||
      !searchForm.flightClass
    );
  }, [searchForm]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: name === 'passengers' ? Number(value) : value
    }));
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchFlights = (e) => {
    e.preventDefault();

    if (isSearchDisabled) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const flights = createMockFlights(searchForm);
    setFlightResults(flights);
  };

  const openBookingModal = (flight) => {
    setSelectedFlight(flight);
    setModalOpen(true);
  };

  const closeBookingModal = () => {
    setModalOpen(false);
    setSelectedFlight(null);
    setBookingForm({
      fullName: '',
      phone: '',
      email: ''
    });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!selectedFlight) return;

    setIsSaving(true);
    try {
      await axios.post('/api/bookings/create', {
        type: 'flight',
        from: searchForm.from,
        to: searchForm.to,
        date: searchForm.date,
        passengers: Number(searchForm.passengers),
        class: searchForm.flightClass,
        fullName: bookingForm.fullName,
        phone: bookingForm.phone,
        email: bookingForm.email,
        paymentMethod: 'Online'
      });

      alert('Flight booking saved successfully.');
      closeBookingModal();
    } catch (error) {
      alert('Error saving flight booking. Please try again.');
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Flight Ticket Booking</h1>
          <p className="text-gray-600 mt-2">Find mock flights, compare fares, and confirm your booking quickly.</p>

          <form onSubmit={handleSearchFlights} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                id="from"
                name="from"
                type="text"
                value={searchForm.from}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Delhi"
                required
              />
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                id="to"
                name="to"
                type="text"
                value={searchForm.to}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Bengaluru"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
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

            <div>
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
              <input
                id="passengers"
                name="passengers"
                type="number"
                min="1"
                value={searchForm.passengers}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="flightClass" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                id="flightClass"
                name="flightClass"
                value={searchForm.flightClass}
                onChange={handleSearchChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-5">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSearchDisabled}
              >
                Search Flights
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flightResults.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900">{flight.airline}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {searchForm.from} to {searchForm.to} on {new Date(searchForm.date).toLocaleDateString()}
              </p>

              <div className="mt-4 space-y-1 text-gray-700">
                <p><span className="font-semibold">Departure:</span> {formatAmPm(flight.departureTime)}</p>
                <p><span className="font-semibold">Arrival:</span> {formatAmPm(flight.arrivalTime)}</p>
                <p><span className="font-semibold">Duration:</span> {flight.duration}</p>
                <p><span className="font-semibold">Class:</span> {searchForm.flightClass}</p>
                <p><span className="font-semibold">Price:</span> Rs. {flight.price}</p>
              </div>

              <button
                type="button"
                onClick={() => openBookingModal(flight)}
                className="mt-5 w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>

        {flightResults.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-600">
            Search flights to view available options.
          </div>
        )}
      </div>

      {modalOpen && selectedFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900">Book {selectedFlight.airline}</h3>
            <p className="text-sm text-gray-600 mt-1">Fill your contact details to confirm the flight booking.</p>

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

export default FlightBooking;
