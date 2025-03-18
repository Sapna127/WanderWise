"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  MapPin,
  Train,
  Hotel,
  Utensils,
  Landmark,
  Palette,
  ShoppingCart,
  Share,
  Edit,
  UserPlus,
  Bookmark,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const itineraryData = {
  tripName: "Parisian Delights: 5-Day Itinerary",
  tripType: "Leisure",
  budget: "Medium",
  transport: "Train",
  accommodation: "Hotel",
  interests: ["Museums", "Food", "Art"],
};

const dummyData = {
  tripName: "Paris",
  history:
    "Paris, situated on the Seine River, boasts a history spanning over two millennia...",
  dailyItinerary: [
    {
      day: 1,
      activities: {
        morning:
          "Arrive in Paris, check into your hotel, and take a stroll along the Seine River. Visit Notre Dame Cathedral.",
        afternoon:
          "Explore Île de la Cité and Île Saint-Louis, enjoying charming streets and architecture.",
        evening: "Dinner at a traditional French bistro in the Latin Quarter.",
      },
    },
    {
      day: 2,
      activities: {
        morning: "Visit the Louvre Museum, focusing on key masterpieces.",
        afternoon:
          "Wander through Tuileries Garden towards Place de la Concorde.",
        evening: "Enjoy a Seine River cruise with dinner.",
      },
    },
  ],
  expenses: {
    daily: { accommodation: 100, food: 50, transport: 75, souvenirs: 25 },
    total: 1500,
  },
  photos: [
    { attraction: "Notre Dame Cathedral", url: "/images/notre-dame.jpg" },
    { attraction: "Louvre Museum", url: "/images/louvre.jpg" },
  ],
};

export default function ItineraryPage() {
  const [openDays, setOpenDays] = useState([]);

  const toggleDay = (day) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded">
            Public Itinerary
          </span>
          <div className="flex gap-5">
            <Share className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <Edit className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <UserPlus className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <Bookmark className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex p-6 gap-6 ">
          <div className="w-2/3 space-y-6">
            {/* History Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  🏛️ History of {dummyData.tripName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                {dummyData.history}
              </CardContent>
            </Card>

            {/* Itinerary Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  📅 Daily Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dummyData.dailyItinerary.map((day) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-50 rounded-lg shadow-md mb-3"
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      className="flex items-center justify-between w-full p-4 text-md font-medium bg-blue-700 text-white rounded-t-lg"
                    >
                      <span >Day {day.day}</span>
                      {openDays.includes(day.day) ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>

                    {openDays.includes(day.day) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 space-y-2 text-gray-700 bg-white rounded-b-lg"
                      >
                        <p>
                          🌅 <strong>Morning:</strong> {day.activities.morning}
                        </p>
                        <p>
                          ☀️ <strong>Afternoon:</strong>{" "}
                          {day.activities.afternoon}
                        </p>
                        <p>
                          🌙 <strong>Evening:</strong> {day.activities.evening}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Expenses Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  💰 Estimated Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-2">
                <p>
                  🏨 Accommodation: ${dummyData.expenses.daily.accommodation}{" "}
                  per day
                </p>
                <p>🍽️ Food: ${dummyData.expenses.daily.food} per day</p>
                <p>
                  🚇 Transport & Activities: $
                  {dummyData.expenses.daily.transport} per day
                </p>
                <p>
                  🛍️ Souvenirs: ${dummyData.expenses.daily.souvenirs} per day
                </p>
                <p className="font-semibold">
                  💵 Total: ${dummyData.expenses.total}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3">
            {/* Photos Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  📸 Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                {dummyData.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-2 rounded-lg shadow-md"
                  >
                    <img
                      src={photo.url}
                      alt={photo.attraction}
                      className="rounded-md"
                    />
                    <p className="mt-2 text-center text-sm font-medium">
                      {photo.attraction}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
