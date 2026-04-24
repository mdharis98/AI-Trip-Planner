import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on unauthenticated landing page (it has its own nav bar).
  if (location.pathname === '/' && !user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer"
            >
              <img src="/logo.png" alt="AI Travel Planner" className="h-16 w-auto object-contain" />
            </button>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/create-trip')}
                className=" text-black px-4 py-2 rounded-lg hover:underline"
              >
                Create Trip
              </button>
              <button
                onClick={() => navigate('/my-trips')}
                className="text-black px-4 py-2 rounded-lg hover:underline"
              >
                My Trips
              </button>
              <button
                onClick={() => navigate('/my-bookings')}
                className="text-black px-4 py-2 rounded-lg hover:underline"
              >
                My Bookings
              </button>
              <div className="relative group">
                <button
                  type="button"
                  className="text-black px-4 py-2 rounded-lg hover:underline flex items-center gap-1"
                >
                  Ticket Booking
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute left-0 top-full mt-1 w-44 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-20">
                  <button
                    type="button"
                    onClick={() => navigate('/train-booking')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg"
                  >
                    Train
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/bus-booking')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    Bus
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/flight-booking')}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg"
                  >
                    Flight
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} className="text-gray-600 hover:underline">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
