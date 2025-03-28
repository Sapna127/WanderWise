"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Avatar from "boring-avatars";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [privateItineraries, setPrivateItineraries] = useState([]);
  const [publicItineraries, setPublicItineraries] = useState([]);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/signin");
          return;
        }

        // Decode token to get user info
        const decoded = jwtDecode(token);

        // Fetch all data in parallel using new endpoints
        const [userRes, privateRes, savedRes, collaboratorsRes, publicRes] =
          await Promise.all([
            fetch("/api/profile/user", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("/api/profile/private", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("/api/profile/saved", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("/api/profile/collaborators", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("/api/itinerary/public", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        // Check all responses
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        if (!privateRes.ok)
          throw new Error("Failed to fetch private itineraries");
        if (!savedRes.ok) throw new Error("Failed to fetch saved itineraries");
        if (!collaboratorsRes.ok)
          throw new Error("Failed to fetch collaborators");
        if (!publicRes.ok)
          throw new Error("Failed to fetch public itineraries");

        // Parse responses
        const userData = await userRes.json();
        const privateData = await privateRes.json();
        const savedData = await savedRes.json();
        const collaboratorsData = await collaboratorsRes.json();
        const publicData = await publicRes.json();

        // Set state
        setUserData({
          name: userData.name || decoded.name || "User",
          email: userData.email || decoded.email,
          userId: decoded.userId,
        });
        setPrivateItineraries(privateData);
        setSavedItineraries(savedData);
        setCollaborators(collaboratorsData);
        setPublicItineraries(publicData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

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

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">No user data found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 mt-10">
        {/* Profile Header */}
        <div className="text-center mb-8 flex gap-3 p-2 justify-center bg-blue-600 text-white">
          <Avatar
            size={36}
            name={userData.user?.name || "Anonymous"}
            variant="beam" // or marble, pixel, sunset, ring, bauhaus
            colors={["#FFAD08", "#EDD75A", "#73B06F", "#0C8F8F", "#405059"]}
            square={false} // makes it circular
            className="rounded-full mt-3" // ensures circular shape
          />
          <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-50">{userData.name}</h1>
          <p className="text-gray-100 ">{userData.email}</p>
          </div>
        </div>

        {/* Collaborators Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            👥 Collaborators/Friends
          </h2>
          {collaborators.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {collaborator.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {collaborator.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No collaborators yet.</p>
          )}
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
          {privateItineraries.length > 0 ? (
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
                    <p className="text-gray-600">🌍 {itinerary.destination}</p>
                    <p className="text-gray-600">
                      📅 {itinerary.duration} days
                    </p>
                    <p className="text-gray-600">💸 {itinerary.budget}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No private itineraries yet.</p>
          )}
        </motion.div>

        {/* Saved Public Itineraries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            💾 Saved Public Itineraries
          </h2>
          {savedItineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedItineraries.map((itinerary) => (
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
                    <p className="text-gray-600">🌍 {itinerary.destination}</p>
                    <p className="text-gray-600">
                      📅 {itinerary.duration} days
                    </p>
                    <p className="text-gray-600">💸 {itinerary.budget}</p>
                    {itinerary.user && (
                      <p className="text-gray-600">
                        👤 Created by: {itinerary.user.name}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No saved itineraries yet.</p>
          )}
        </motion.div>
      </div>
    </>
  );
}
