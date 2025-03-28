"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

export default function SocialPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch all public itineraries
  useEffect(() => {
    const fetchPublicItineraries = async () => {
      try {
        const response = await fetch("/api/itinerary/public");
        if (!response.ok) {
          throw new Error("Failed to fetch public itineraries");
        }
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error("Error fetching public itineraries:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicItineraries();
  }, []);

  // Navigate to the itinerary's info page
  const handleCardClick = (itineraryId) => {
    router.push(`/itinerary/info/{itineraryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading public itineraries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 mt-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
          🌍 Public Itineraries
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No public itineraries found.
            </p>
          ) : (
            itineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                onClick={() => handleCardClick(itinerary.id)}
                className="cursor-pointer group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Card Image with Gradient Overlay */}
                <div className="relative h-56 w-full">
                  {/* Dynamic background based on destination (you could make this more sophisticated) */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      itinerary.destination.includes("Beach")
                        ? "from-cyan-400 to-blue-600"
                        : itinerary.destination.includes("Mountain")
                        ? "from-emerald-400 to-green-600"
                        : "from-purple-400 to-indigo-600"
                    }`}
                  ></div>

                  {/* Destination Image Placeholder (you could add actual images later) */}
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <svg
                      className="w-20 h-20 text-white/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1"
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeWidth="1"
                        d="M9 22V12h6v10"
                      ></path>
                    </svg>
                  </div>

                  {/* Card Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full shadow-sm">
                      {itinerary.tripType}
                    </span>
                    {itinerary.visibility === "PRIVATE" && (
                      <span className="px-2 py-1 bg-rose-100 text-rose-800 text-xs font-medium rounded-full shadow-sm">
                        Private
                      </span>
                    )}
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-xl font-bold text-white line-clamp-1">
                      {itinerary.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {itinerary.destination}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="bg-white p-5">
                  {/* Meta Information */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {itinerary.duration} days
                      </span>
                      <span className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {itinerary.budget}
                      </span>
                    </div>

                    {/* User Avatar */}
                    {itinerary.user && (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2 hidden sm:inline">
                          {itinerary.user.name}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {itinerary.user.image ? (
                            <img
                              src={itinerary.user.image}
                              alt={itinerary.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {itinerary.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interests/Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {JSON.parse(itinerary.interests).map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* View Button (appears on hover) */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-6 py-2 bg-white rounded-full shadow-md font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
