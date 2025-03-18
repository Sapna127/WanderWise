"use client"
import { useState } from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Itinerary Generator",
    desc: "Get personalized travel plans based on your preferences.",
    image: "/images/itinerary.png",
  },
  {
    title: "Smart Expense & Budget Tracker",
    desc: "Track your travel expenses in real-time with AI insights.",
    image: "/images/budget.png",
  },
  {
    title: "Flight & Hotel Price Prediction",
    desc: "AI predicts the best time to book flights and hotels.",
    image: "/images/price-prediction.png",
  },
  {
    title: "Route Optimization & Smart Maps",
    desc: "Find the most efficient travel routes for your journey.",
    image: "/images/maps.png",
  },
];

export default function FeatureSlider() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex gap-8 p-20 items-center">
      {/* Left Column - Feature List */}
      <div className="flex flex-col gap-4 w-1/2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selected === index ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelected(index)}
            initial={{ scale: 1 }}
            animate={{
              scale: selected === index ? 1.05 : 1,
              backgroundColor: selected === index ? "#3B82F6" : "#F3F4F6",
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            {selected === index && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                {feature.desc}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Right Column - Image Display */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/2"
      >
        <img
          src={features[selected].image}
          alt={features[selected].title}
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
}
