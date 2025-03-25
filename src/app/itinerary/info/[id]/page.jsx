"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useParams } from "next/navigation"; // Fix
import { Share, Edit, UserPlus, Bookmark } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function ItineraryPage() {
  const [openDays, setOpenDays] = useState([]);


  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // Initialize as an empty array
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);

 
  const params = useParams(); 
  const itineraryId = params?.id;
  
  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component
  
    const fetchItineraryData = async () => {
      try {
        if (!itineraryId) throw new Error("Itinerary ID not found");
  
        setLoading(true);
        const response = await fetch(`/api/itinerary/${itineraryId}`);
  
        if (!response.ok) throw new Error("Failed to fetch itinerary data");
  
        const data = await response.json();
  
        if (isMounted) {
          setItineraryData({
            ...data,
            itineraryData: JSON.parse(data.itineraryData), // Fix the parsing issue
          });
          setError(null);
        }
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchItineraryData();
  
    return () => {
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, [itineraryId]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const response = await fetch(
          `/api/itinerary/reviews?id=${itineraryId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data || []); // Ensure reviews is an array
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviewError(error.message);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (itineraryId) {
      fetchReviews();
    }
  }, [itineraryId]);

  const toggleDay = (day) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.comment) {
      alert("Please provide a rating and comment.");
      return;
    }

    try {
      const response = await fetch("/api/itinerary/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3OWE5MzhlZS1lZDY4LTRjMmMtOGFiOC0zOGI3MTExNDUwM2UiLCJlbWFpbCI6InNha3NoaUBnbWFpbC5jb20iLCJpYXQiOjE3NDIzOTA5MDUsImV4cCI6MTc0Mjk5NTcwNX0.Rchd2PFDgZKgVe7TPYk97SKqxbEtnxOu7TZhK93jHw0",
        },
        body: JSON.stringify({
          itineraryId,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      setReviews((prev) => [data, ...prev]);
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Loading itinerary...</p>
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

  if (!itineraryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">No itinerary data found.</p>
      </div>
    );
  }

  // ... (keep all your imports and initial state declarations)

return (
  <>
    <Navbar />
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded">
          {itineraryData.visibility === "PUBLIC"
            ? "Public Itinerary"
            : "Private Itinerary"}
        </span>
        <div className="flex gap-5">
          <Share className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          <Edit className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          <UserPlus className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          <Bookmark className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex p-6 gap-6">
        <div className="w-2/3 space-y-6">
          {/* History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                🏛️ History of {itineraryData.destination}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              {itineraryData.itineraryData?.history || "No history available."}
            </CardContent>
          </Card>

          {/* Itinerary Section - Updated to match your API structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                📅 Daily Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {itineraryData.itineraryData?.dailyItinerary?.map((day) => (
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
                    <span>Day {day.day}</span>
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
                      className="p-4 space-y-4 text-gray-700 bg-white rounded-b-lg"
                    >
                      <div>
                        <h4 className="font-semibold mb-2">Activities:</h4>
                        <ul className="space-y-2">
                          {day.activities?.map((activity, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Meals:</h4>
                        <ul className="space-y-2">
                          {day.meals?.map((meal, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              {meal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Expenses Section - Updated to match your API structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                💰 Estimated Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-2">
              <p>
                🍽️ Food: ₹{itineraryData.itineraryData?.expenses?.daily?.food || "N/A"} per day
              </p>
              <p>
                🚇 Transport: ₹{itineraryData.itineraryData?.expenses?.daily?.transport || "N/A"} per day
              </p>
              <p>
                🎟️ Activities: ₹{itineraryData.itineraryData?.expenses?.daily?.activities || "N/A"} per day
              </p>
              <p className="font-semibold">
                💵 Total: ₹{itineraryData.itineraryData?.expenses?.total || "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Reviews Section (keep this part the same) */}
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                📝 Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Display Reviews */}
              <div className="space-y-3">
                {loadingReviews ? (
                  <p className="text-gray-500 text-center">
                    Loading reviews...
                  </p>
                ) : reviewError ? (
                  <p className="text-red-500 text-center">{reviewError}</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500 text-center">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 bg-gray-100 rounded-lg shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {review.user?.name || "Anonymous"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-800 mt-1">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Button */}
              {!newReview.open && (
                <Button
                  onClick={() =>
                    setNewReview((prev) => ({ ...prev, open: true }))
                  }
                  className="w-full bg-blue-700 text-white mt-4"
                >
                  Add Review
                </Button>
              )}

              {/* Add Review Form */}
              {newReview.open && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-3 border-t pt-4 mt-4"
                >
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Rating:</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReview((prev) => ({
                              ...prev,
                              rating: star,
                            }))
                          }
                          className={`text-xl ${
                            newReview.rating >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    required
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-700 text-white"
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        setNewReview({ open: false, rating: 0, comment: "" })
                      }
                      className="flex-1 bg-gray-500 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </>
);
}
