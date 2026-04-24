import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import Itinerary from './pages/Itinerary';
import MyBookings from './pages/MyBookings';
import TrainBooking from './pages/TrainBooking';
import BusBooking from './pages/BusBooking';
import FlightBooking from './pages/FlightBooking';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/create-trip" element={user ? <CreateTrip /> : <Navigate to="/" />} />
        <Route path="/my-trips" element={user ? <MyTrips /> : <Navigate to="/" />} />
        <Route path="/itinerary/:id" element={user ? <Itinerary /> : <Navigate to="/" />} />
        <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/" />} />
        <Route path="/train-booking" element={user ? <TrainBooking /> : <Navigate to="/" />} />
        <Route path="/bus-booking" element={user ? <BusBooking /> : <Navigate to="/" />} />
        <Route path="/flight-booking" element={user ? <FlightBooking /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;