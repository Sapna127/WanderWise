"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useParams } from "next/navigation"; // Fix
import { Share, Edit, UserPlus, Bookmark } from "lucide-react";
import Avatar from "boring-avatars";
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
        const response = await fetch(`/api/itinerary/reviews/${itineraryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data || []);
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
      setReviewError("Please provide both a rating and comment");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/signin");
        return;
      }

      const response = await fetch("/api/itinerary/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      setNewReview({ open: false, rating: 0, comment: "" });
      setReviewError(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError(error.message || "Failed to submit review");
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
                {itineraryData.itineraryData?.history ||
                  "No history available."}
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
                  🍽️ Food: ₹
                  {itineraryData.itineraryData?.expenses?.daily?.food || "N/A"}{" "}
                  per day
                </p>
                <p>
                  🚇 Transport: ₹
                  {itineraryData.itineraryData?.expenses?.daily?.transport ||
                    "N/A"}{" "}
                  per day
                </p>
                <p>
                  🎟️ Activities: ₹
                  {itineraryData.itineraryData?.expenses?.daily?.activities ||
                    "N/A"}{" "}
                  per day
                </p>
                <p className="font-semibold">
                  💵 Total: ₹
                  {itineraryData.itineraryData?.expenses?.total || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="w-1/3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display Reviews */}
                <div className="space-y-4">
                  {loadingReviews ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : reviewError ? (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center">
                      {reviewError}
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="mt-2">
                        No reviews yet. Be the first to review!
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={36}
                              name={review.user?.name || "Anonymous"}
                              variant="beam" // or marble, pixel, sunset, ring, bauhaus
                              colors={[
                                "#FFAD08",
                                "#EDD75A",
                                "#73B06F",
                                "#0C8F8F",
                                "#405059",
                              ]}
                              square={false} // makes it circular
                              className="rounded-full" // ensures circular shape
                            />
                            <div>
                              <p className="font-medium text-gray-800">
                                {review.user?.name || "Anonymous"}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Review Section */}
                {!newReview.open ? (
                  <Button
                    onClick={() =>
                      setNewReview({ open: true, rating: 0, comment: "" })
                    }
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    variant="default"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Review
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
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
                              className={`p-1 rounded-full ${
                                newReview.rating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Review
                        </label>
                        <textarea
                          id="comment"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Share your experience..."
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={
                            newReview.rating === 0 || !newReview.comment.trim()
                          }
                        >
                          Submit Review
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            setNewReview({
                              open: false,
                              rating: 0,
                              comment: "",
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
