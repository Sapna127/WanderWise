"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const images = [
  //   { name: "Chichen Itza", src: "/hero/chichen.webp", link: "https://en.wikipedia.org/wiki/Chichen_Itza" },
  //   { name: "Christ the Redeemer", src: "/hero/christ.webp", link: "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)" },
  //   { name: "Colosseum", src: "/hero/colosseum.webp", link: "https://en.wikipedia.org/wiki/Colosseum" },
  
  //   { name: "Machu Picchu", src: "/hero/peru.webp", link: "https://en.wikipedia.org/wiki/Machu_Picchu" },
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
  //   {
  //     name: "India Gate",
  //     src: "/hero/india.webp",
  //     link: "https://en.wikipedia.org/wiki/India_Gate",
  //   },
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
  // { name: "Sydney Opera House", src: "/hero/sydney.webp", link: "https://en.wikipedia.org/wiki/Sydney_Opera_House" },
  //   { name: "Mount Everest", src: "/hero/everest.webp", link: "https://en.wikipedia.org/wiki/Mount_Everest" },
  //   { name: "Stonehenge", src: "/hero/stonehenge.webp", link: "https://en.wikipedia.org/wiki/Stonehenge" },
];

export default function DestinationsGrid() {
  return (
    <>
      <div className="flex flex-col items-center text-center pt-20  ">
        <h1 className="text-4xl font-bold text-gray-900 max-w-2xl leading-tight">
          Explore some{" "}
          <span className="text-blue-500"> mostly visited Destinations</span>
        </h1>
        <p className="text-lg text-gray-600 mt-5 max-w-lg">
          Edit these premade itineraries as you wish..
        </p>
      </div>
      <motion.div
        className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 pl-20 pr-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {images.map((img, index) => (
          <motion.div
            key={index}
            className={`relative overflow-hidden rounded-xl shadow-lg ${
              index % 5 === 0
                ? "col-span-2 row-span-2 "
                : "col-span-1 row-span-1 "
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={img.link} target="_blank">
              <Image
                src={img.src}
                alt={img.name}
                width={50}
                height={50}
                className="w-full h-full object-cover transition-all duration-300 hover:brightness-75"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md">
                {img.name}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
