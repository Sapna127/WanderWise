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
    visibility: "PRIVATE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const handleCardSelect = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const budgetMap = {
      Cheap: "Low",
      "Mid-range": "Medium",
      Luxury: "High",
    };

    const payload = {
      destination: formData.destination,
      duration: parseInt(formData.duration, 10),
      tripType: formData.tripType,
      budget: budgetMap[formData.budget] || formData.budget,
      transport: formData.transport,
      accommodation: formData.accommodation,
      interests: formData.interests,
      visibility: formData.visibility,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const res = await axios.post("/api/itinerary/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OWE5MzhlZS1lZDY4LTRjMmMtOGFiOC0zOGI3MTExNDUwM2UiLCJlbWFpbCI6InNha3NoaUBnbWFpbC5jb20iLCJpYXQiOjE3NDIzOTA5MDUsImV4cCI6MTc0Mjk5NTcwNX0.Rchd2PFDgZKgVe7TPYk97SKqxbEtnxOu7TZhK93jHw0",
        },
      });

      router.push("/itinerary/info");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-8 w-full mx-auto mt-16 md:mt-20">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center text-gray-800">
          ✈️ Tell us about your travel preferences! ✨
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 md:space-y-6 max-w-2xl mx-auto"
        >
          {/* Destination */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              🌍 Where do you want to Explore?
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter city or country"
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              📅 How long is your Trip?
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Number of days"
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Trip Type Cards */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              👥 Who are you traveling with?
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { value: "Solo Travel", emoji: "🌿" },
                { value: "Partner", emoji: "❤️" },
                { value: "Family", emoji: "👨‍👩‍👧‍👦" },
                { value: "Friends", emoji: "🎉" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleCardSelect("tripType", option.value)}
                  className={`flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all ${
                    formData.tripType === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-sm md:text-base text-gray-700">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Cards */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              💸 What is your Budget?
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { value: "Cheap", emoji: "💰" },
                { value: "Mid-range", emoji: "💎" },
                { value: "Luxury", emoji: "👑" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleCardSelect("budget", option.value)}
                  className={`flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all ${
                    formData.budget === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-sm md:text-base text-gray-700">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transport Cards */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              🚌 Preferred Transport
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { value: "Public Transport", emoji: "🚋" },
                { value: "Car Rental", emoji: "🚗" },
                { value: "Bicycle", emoji: "🚲" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleCardSelect("transport", option.value)}
                  className={`flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all ${
                    formData.transport === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-sm md:text-base text-gray-700">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation Cards */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              🏨 Accommodation Type
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { value: "Hotel", emoji: "🏨" },
                { value: "Hostel", emoji: "🏕️" },
                { value: "Airbnb", emoji: "🏡" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    handleCardSelect("accommodation", option.value)
                  }
                  className={`flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all ${
                    formData.accommodation === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-sm md:text-base text-gray-700">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              🎯 Interests
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {["Culture", "Food", "Adventure", "Shopping", "Nature"].map(
                (interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-all"
                  >
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest}
                      checked={formData.interests.includes(interest)}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <span className="text-sm md:text-base text-gray-700">
                      {interest}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
                📅 Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
                📅 End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-base md:text-lg font-medium mb-2 text-gray-700">
              🔒 Visibility
            </label>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { value: "PUBLIC", emoji: "🌍" },
                { value: "PRIVATE", emoji: "🔒" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleCardSelect("visibility", option.value)}
                  className={`flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-all ${
                    formData.visibility === option.value
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className="text-sm md:text-base text-gray-700">
                    {option.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t-2 border-gray-300 flex justify-end p-3 w-full">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Itinerary"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
