"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const images = [
  {
    name: "Taj Mahal",
    src: "/images/taj.webp",
    link: "https://en.wikipedia.org/wiki/Taj_Mahal",
  },
  {
    name: "Great Pyramid of Giza",
    src: "/images/giza.webp",
    link: "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza",
  },
  {
    name: "Great Wall of China",
    src: "/images/wall.webp",
    link: "https://en.wikipedia.org/wiki/Great_Wall_of_China",
  },
  {
    name: "Eiffel Tower",
    src: "/images/tower.webp",
    link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
  },
  {
    name: "Statue of Liberty",
    src: "/images/liberty.webp",
    link: "https://en.wikipedia.org/wiki/Statue_of_Liberty",
  },
];

export default function DestinationsGrid() {
  return (
    <div className="flex flex-col items-center text-center pt-10 md:pt-20 bg-gray-50">
      {/* Header Section */}
      <div className="px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 max-w-2xl leading-tight">
          Explore some{" "}
          <span className="text-blue-500">mostly visited Destinations</span>
        </h1>
        <p className="text-sm md:text-lg text-gray-600 mt-3 md:mt-5 max-w-lg">
          Edit these premade itineraries as you wish..
        </p>
      </div>

      {/* Image Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            className={`relative overflow-hidden rounded-xl shadow-lg ${
              index % 5 === 0
                ? "sm:col-span-2 sm:row-span-2"
                : "col-span-1 row-span-1"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={img.link} target="_blank" aria-label={`Learn more about ${img.name}`}>
              <div className="relative aspect-square w-full">
                <Image
                  src={img.src}
                  alt={img.name}
                  fill
                  className="object-cover transition-all duration-300 hover:brightness-75"
                  priority={index < 2} // Prioritize loading for the first two images
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md">
                {img.name}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}