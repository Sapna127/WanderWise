import { Map, Users, DollarSign, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    icon: <Brain size={20} className="text-blue-500" />,
    title: "AI-Powered Itinerary Generator",
    description: "Create personalized travel plans with AI-driven insights.",
  },
  {
    id: 2,
    icon: <DollarSign size={20} className="text-blue-500" />,
    title: "Smart Expense & Budget Tracker",
    description: "Optimize your travel budget with real-time expense tracking.",
  },
  {
    id: 3,
    icon: <Map size={20} className="text-blue-500" />,
    title: "Route Optimization & Smart Maps",
    description: "Plan efficient routes with AI-powered smart mapping.",
  },
  {
    id: 4,
    icon: <Users size={20} className="text-blue-500" />,
    title: "Social & Community Features",
    description: "Connect, share, and collaborate with fellow travelers.",
  },
];

export default function ServicesSection() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center text-center p-12 pt-[100px]">
        <h1 className="text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          Craft Unforgettable Journeys With{" "}
          <span className="text-blue-500">AI-Trip Planning</span>
        </h1>
        <p className="text-lg text-gray-600 mt-5 max-w-xl">
          Plan stress-free trips with AI-powered itinerary building, smart
          budgeting, and seamless route optimization.
        </p>
        <Button className="mt-6 px-10 py-5 text-lg bg-blue-600 hover:bg-blue-700 text-white  shadow-lg transition-all transform hover:scale-105">
          Start Planning
        </Button>
        <p className="mt-5 text-gray-700">
          Already have an account?{" "}
          <span className="underline text-blue-500 cursor-pointer hover:text-blue-700 text-sm">
            Log in
          </span>
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-4xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center text-center transition-all transform hover:scale-105 relative overflow-hidden"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-full border border-gray-300 p-3 flex items-center justify-center relative">
                {service.icon}
              </div>

              {/* Description */}
              <p className="text-sm text-black relative  mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
