"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function TripPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    duration: "",
    tripType: "",
    budget: "",
    transport: "",
    accommodation: "",
    interests: [],
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i) => i !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/itinerary/generate", formData);
      setTripData(JSON.parse(res.data.itineraryData));
    } catch (err) {
      setError("Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  return (
    
    <>
    <Navbar/>
    <div className="p-8 w-full mx-auto mt-20">
      
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
         Tell us your travel preferences✨
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 pl-20 pr-20">
        {/* Destination */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            🌍 Where do you want to Explore?
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Enter city or country"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            📅 How long is your Trip?
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Number of days"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Trip Type */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            👥 Who are you traveling with?
          </label>
          <select
            name="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Solo Travel">🌿 Solo Travel</option>
            <option value="Partner">❤️ Partner</option>
            <option value="Family">👨‍👩‍👧‍👦 Family</option>
            <option value="Friends">🎉 Friends</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            💸 What is your Budget?
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Budget">💰 Cheap</option>
            <option value="Mid-range">💎 Moderate</option>
            <option value="Luxury">👑 Luxury</option>
          </select>
        </div>

        {/* Transport */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            🚌 Preferred Transport
          </label>
          <select
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Public Transport">🚋 Public Transport</option>
            <option value="Car Rental">🚗 Car Rental</option>
            <option value="Bicycle">🚲 Bicycle</option>
          </select>
        </div>

        {/* Accommodation */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            🏨 Accommodation Type
          </label>
          <select
            name="accommodation"
            value={formData.accommodation}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Hotel">🏨 Hotel</option>
            <option value="Hostel">🏕️ Hostel</option>
            <option value="Airbnb">🏡 Airbnb</option>
          </select>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-lg font-medium mb-2 text-gray-700">
            🎯 Interests
          </label>
          <div className="flex flex-wrap gap-3">
            {["Culture", "Food", "Adventure", "Shopping", "Nature"].map(
              (interest) => (
                <label
                  key={interest}
                  className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-all"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  <span className="text-gray-700">{interest}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2 text-gray-700">
              📅 Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex-1">
            <label className="block text-lg font-medium mb-2 text-gray-700">
              📅 End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="border-t-2 border-gray-300 flex justify-end p-3 w-full">
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95"
            disabled={loading}
            onClick={()=> router.push("/itinerary/info")}
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
