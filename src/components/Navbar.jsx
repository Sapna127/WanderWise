"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plane, Map, Users, DollarSign, Brain, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (!open) {
      const animatePlane = async () => {
        await controls.start({
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
          transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
        });
      };
      animatePlane();
    }
  }, [controls, open]);

  const handlePlaneClick = async () => {
    await controls.start({
      y: -1000,
      opacity: 0,
      rotate: 360,
      scale: 0.5,
      transition: { duration: 1.5, ease: "easeInOut" },
    });

    setOpen(true);

    setTimeout(() => {
      controls.start({
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: { duration: 0 },
      });
    }, 1500);
  };

  return (
    <>
      {/* Toggle Button (Plane or Close) */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer"
      >
        {open ? (
          <motion.div className="w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full shadow-md">
            <X size={24} />
          </motion.div>
        ) : (
          <motion.div animate={controls} className="w-10 h-10 text-blue-500">
            <Plane className="w-full h-full" />
          </motion.div>
        )}
      </motion.div>

      {/* Full-Page Navbar */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center space-y-4 p-6"
        >
          <Button className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg">
            <Brain size={20} />
            <span>Create Itinerary</span>
          </Button>
          <div className="w-full border-b border-gray-200" />
          <Button className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg">
            <DollarSign size={20} />
            <span>Budget</span>
          </Button>
          <div className="w-full border-b border-gray-200" />
          <Button className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg">
            <Users size={20} />
            <span>Social</span>
          </Button>
          <div className="w-full border-b border-gray-200" />
          <Button className="flex items-center space-x-2 text-lg bg-transparent hover:bg-gray-100 text-gray-800 w-full justify-center p-4 rounded-lg">
            <Map size={20} />
            <span>Maps</span>
          </Button>
        </motion.div>
      )}
    </>
  );
}
