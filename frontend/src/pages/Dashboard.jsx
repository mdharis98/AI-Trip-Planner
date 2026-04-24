import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-orange-500 leading-tight">
          Discover Your Next Adventure with AI
        </h1>

        <h2 className="mt-5 text-4xl md:text-6xl font-extrabold text-black leading-tight">
          Personalized Itineraries at Your Fingertips
        </h2>

        <p className="mt-10 text-xl text-slate-600 max-w-4xl mx-auto">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

        <button
          type="button"
          onClick={() => navigate('/create-trip')}
          className="mt-10 bg-zinc-900 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-zinc-800"
        >
          Get Started, It&apos;s Free
        </button>
      </div>
    </div>
  );
};

export default Dashboard;