import { useMemo, useState } from 'react';
import axios from 'axios';

const BUS_NAMES = [
  'GreenLine Travels',
  'RedBus Express',
  'CityLink Coaches',
  'InterState Rider',
  'BlueStar Mobility'
];

const BUS_TYPES = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater'];

const formatToAmPm = (dateTime) => {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const createMockBusResults = ({ from, to, date, passengers }) => {
  const seed = `${from}${to}${date}${passengers}`.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return BUS_NAMES.slice(0, 4).map((busName, index) => {
    const departHour = 6 + ((seed + index * 2) % 14);
    const departMinute = (seed + index * 13) % 60;
    const price = 450 + ((seed + index * 97) % 1250);

    return {
      id: `BUS-${index + 1}`,
      name: busName,
      type: BUS_TYPES[(seed + index) % BUS_TYPES.length],
      departureTime: `${date}T${String(departHour).padStart(2, '0')}:${String(departMinute).padStart(2, '0')}:00.000Z`,
      price
    };
  });
};

const BusBooking = () => {
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const [busResults, setBusResults] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
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
      !searchForm.passengers ||
      Number(searchForm.passengers) < 1
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

  const handleSearchBuses = (e) => {
    e.preventDefault();

    if (isSearchDisabled) {
      alert('Please fill all required fields correctly.');
      return;
    }

    const results = createMockBusResults(searchForm);
    setBusResults(results);
  };

  const handleOpenModal = (bus) => {
    setSelectedBus(bus);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBus(null);
    setBookingForm({
      fullName: '',
      phone: '',
      email: ''
    });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!selectedBus) return;

    setIsSaving(true);
    try {
      await axios.post('/api/bookings/create', {
        type: 'bus',
        from: searchForm.from,
        to: searchForm.to,
        date: searchForm.date,
        passengers: Number(searchForm.passengers),
        fullName: bookingForm.fullName,
        phone: bookingForm.phone,
        email: bookingForm.email,
        paymentMethod: 'Online'
      });

      alert('Bus booking saved successfully.');
      handleCloseModal();
    } catch (error) {
      alert('Error saving bus booking. Please try again.');
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900">Bus Ticket Booking</h1>
          <p className="text-gray-600 mt-2">Search buses with mock data and complete your bus booking.</p>

          <form onSubmit={handleSearchBuses} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                placeholder="e.g. Jaipur"
                required
              />
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

            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSearchDisabled}
              >
                Search Buses
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {busResults.map((bus) => (
            <div key={bus.id} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{bus.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {searchForm.from} to {searchForm.to} on {new Date(searchForm.date).toLocaleDateString()}
              </p>
              <div className="mt-4 space-y-1 text-gray-700">
                <p><span className="font-semibold">Type:</span> {bus.type}</p>
                <p><span className="font-semibold">Departure:</span> {formatToAmPm(bus.departureTime)}</p>
                <p><span className="font-semibold">Price:</span> Rs. {bus.price}</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenModal(bus)}
                className="mt-5 w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Book
              </button>
            </div>
          ))}
        </div>

        {busResults.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-600">
            Search buses to view available options.
          </div>
        )}
      </div>

      {modalOpen && selectedBus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900">Book {selectedBus.name}</h3>
            <p className="text-sm text-gray-600 mt-1">Fill your contact details to confirm the bus booking.</p>

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
                  onClick={handleCloseModal}
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

export default BusBooking;
