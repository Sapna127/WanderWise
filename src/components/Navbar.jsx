"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plane, User, Users, DollarSign, Brain, X, House } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const controls = useAnimation();
  const router = useRouter();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth idle movement for the plane
  useEffect(() => {
    if (!open) {
      controls.start({
        x: [0, -2, 3, -3, 2, -1, 0],
        y: [0, -2, 4, -3, 2, -1, 0],
        rotate: [0, -1, 1, -2, 2, 0],
        transition: {
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, open]);

  const handlePlaneClick = async () => {
    if (!open) {
      await controls.start({
        x: [0, -20, -40, -30],
        y: [0, -50, -100, -300],
        rotate: [0, -10, -15, 0],
        scale: [1, 1.1, 1.2, 1],
        transition: { duration: 1.5, ease: "easeInOut" },
      });
      setOpen(true);
    } else {
      setOpen(false);
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: { duration: 1, ease: "easeInOut" },
      });
    }
  };

  return (
    <>
      {/* Fixed plane button inside a semicircle when scrolled */}
      <div
        className={`fixed top-3 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-blue/90 backdrop-blur-sm shadow-md p-3 rounded-full"
            : "bg-transparent"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlaneClick}
          animate={controls}
          className="w-14 h-14 flex items-center justify-center cursor-pointer"
        >
          <img
            src="/plane.png"
            alt="Plane"
            className="w-10 h-10 object-contain"
          />
        </motion.div>
      </div>

      {/* Full-Page Navbar */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center space-y-4 p-6"
        >
          <Button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg"
          >
            <House size={20} />
            <span>Home</span>
          </Button>
          <Button
            onClick={() => router.push("/itinerary")}
            className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg"
          >
            <Brain size={20} />
            <span>Create Itinerary</span>
          </Button>
          <div className="w-full border-b border-gray-200" />
          <Button
            onClick={() => router.push("/budget")}
            className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg"
          >
            <DollarSign size={20} />
            <span>Budget</span>
          </Button>
          <div className="w-full border-b border-gray-200" />
          <Button
            onClick={() => router.push("/social")}
            className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg"
          >
            <Users size={20} />
            <span>Social</span>
          </Button>
          <div className="w-full border-b border-gray-200" />
          <Button
            onClick={() => router.push("/profile")}
            className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg"
          >
            <User size={20} />
            <span>Profile</span>
          </Button>

          {/* Close button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(false)}
            className="mt-10 w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full shadow-md"
          >
            <X size={24} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
