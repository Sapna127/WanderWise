"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    collaborators: [
      { id: 1, name: "Jane Doe", email: "jane.doe@example.com" },
      { id: 2, name: "Alice Smith", email: "alice.smith@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
    ],
  });

  const [privateItineraries, setPrivateItineraries] = useState([
    {
      id: 1,
      title: "Trip to Paris",
      destination: "Paris",
      duration: 7,
      budget: "Medium",
    },
    {
      id: 2,
      title: "Weekend in the Mountains",
      destination: "Swiss Alps",
      duration: 3,
      budget: "High",
    },
  ]);

  const [publicItineraries, setPublicItineraries] = useState([
    {
      id: 3,
      title: "Beach Vacation",
      destination: "Maldives",
      duration: 10,
      budget: "Luxury",
      createdBy: "Alice Smith",
    },
    {
      id: 4,
      title: "City Tour",
      destination: "New York",
      duration: 5,
      budget: "Mid-range",
      createdBy: "Jane Doe",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading profile data...</p>
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
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
          <p className="text-gray-600">{userData.email}</p>
        </div>

        {/* Collaborators Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            👥 Collaborators/ Friends
          </h2>
          <div className="flex flex-wrap gap-3">
            {userData.collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://github.com/${collaborator.name.toLowerCase().replace(/\s+/g, '-')}.png`} />
                  <AvatarFallback>
                    {collaborator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {collaborator.name}
                  </p>
                  <p className="text-xs text-gray-500">{collaborator.email}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Private Itineraries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🔒 Private Itineraries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {privateItineraries.map((itinerary) => (
              <Card
                key={itinerary.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {itinerary.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    🌍 {itinerary.destination}
                  </p>
                  <p className="text-gray-600">
                    📅 {itinerary.duration} days
                  </p>
                  <p className="text-gray-600">
                    💸 {itinerary.budget}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Public Itineraries Saved Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🌍 Public Itineraries Saved
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publicItineraries.map((itinerary) => (
              <Card
                key={itinerary.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {itinerary.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    🌍 {itinerary.destination}
                  </p>
                  <p className="text-gray-600">
                    📅 {itinerary.duration} days
                  </p>
                  <p className="text-gray-600">
                    💸 {itinerary.budget}
                  </p>
                  <p className="text-gray-600">
                    👤 Created by: {itinerary.createdBy}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}