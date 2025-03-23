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
    router.push(`/itinerary/info?id=${itineraryId}`);
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
      <div className="min-h-screen bg-gray-50 p-6 mt-10" >
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
                className="cursor-pointer group"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <h2 className="text-white text-2xl font-bold text-center">
                        {itinerary.title}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">
                        🌍 {itinerary.destination}
                      </span>
                      <span className="text-sm text-gray-600">
                        📅 {itinerary.duration} days
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        💸 {itinerary.budget}
                      </span>
                      <span className="text-sm text-gray-600">
                        👤 {itinerary.user?.name || "Unknown"}
                      </span>
                    </div>
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