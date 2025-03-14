"use client"
import { useState } from 'react';
import axios from 'axios';

export default function TripPlanner() {
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    tripType: '',
    budget: '',
    transport: '',
    accommodation: '',
    interests: [],
    startDate: '',
    endDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tripData, setTripData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((i) => i !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/itinerary/generate', formData);
      setTripData(JSON.parse(res.data.itineraryData));
    } catch (err) {
      setError('Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">✈️ Plan Your Dream Trip ✨</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">🌍 Where do you want to Explore?</label>
          <input 
            type="text" 
            name="destination" 
            value={formData.destination} 
            onChange={handleChange} 
            placeholder="Enter city or country" 
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">📅 How long is your Trip?</label>
          <input 
            type="number" 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange} 
            placeholder="Number of days" 
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">👥 Who are you traveling with?</label>
          <select name="tripType" value={formData.tripType} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="Solo Travel">🌿 Solo Travel</option>
            <option value="Partner">❤️ Partner</option>
            <option value="Family">👨‍👩‍👧‍👦 Family</option>
            <option value="Friends">🎉 Friends</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">💸 What is your Budget?</label>
          <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="Budget">💰 Cheap</option>
            <option value="Mid-range">💎 Moderate</option>
            <option value="Luxury">👑 Luxury</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">🚌 Preferred Transport</label>
          <select name="transport" value={formData.transport} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="Public Transport">🚋 Public Transport</option>
            <option value="Car Rental">🚗 Car Rental</option>
            <option value="Bicycle">🚲 Bicycle</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">🏨 Accommodation Type</label>
          <select name="accommodation" value={formData.accommodation} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="Hotel">🏨 Hotel</option>
            <option value="Hostel">🏕️ Hostel</option>
            <option value="Airbnb">🏡 Airbnb</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">🎯 Interests</label>
          <div className="flex flex-wrap gap-3">
            {['Culture', 'Food', 'Adventure', 'Shopping', 'Nature'].map((interest) => (
              <label key={interest} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="interests" 
                  value={interest} 
                  checked={formData.interests.includes(interest)} 
                  onChange={handleChange} 
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">📅 Start Date</label>
            <input 
              type="date" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">📅 End Date</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </form>
    </div>
  );
}
