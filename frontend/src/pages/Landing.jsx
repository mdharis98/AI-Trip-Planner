import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-16 items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-black px-4 py-2 rounded-lg font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4">
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
            onClick={() => setIsModalOpen(true)}
            className="mt-10 bg-zinc-900 text-white px-8 py-3 rounded-xl text-xl font-semibold hover:bg-zinc-800"
          >
            Get Started, It&apos;s Free
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AuthForm onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default Landing;