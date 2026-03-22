"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  {
    heading: "Premium Phones\n& Accessories",
    description:
      "Your one-stop shop for the latest smartphones and accessories. From flagship phones to AirPods, chargers, and cases — we have everything you need. Shop now and get it delivered to your door.",
    salePrice: "320",
    originalPrice: "550",
    discount: "30%",
    image: "/images/hero-1.png",
  },
  {
    heading: "Top Brands\n& Best Deals",
    description:
      "Discover our collection of phones and accessories from Apple, Samsung, Google, and more. Premium quality at the best prices in Tunisia. Free delivery on orders over 200 TND.",
    salePrice: "450",
    originalPrice: "750",
    discount: "40%",
    image: "/images/hero-2.png",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="bg-cream">
      <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-16">
        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-4">
          {/* Left Content */}
          <div className="flex-1 z-10 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 leading-tight whitespace-pre-line">
              {slide.heading}
            </h1>
            <p className="mt-5 text-gray-600 text-base leading-7 max-w-md">
              {slide.description}
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {slide.salePrice} <span className="text-lg">TND</span>
              </span>
              <span className="text-lg text-gray-400 line-through">
                {slide.originalPrice} TND
              </span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button className="bg-forest hover:bg-forest-light text-white px-7 py-3 rounded-md text-sm font-semibold transition-colors">
                Shop Now
              </button>
              <button className="border-2 border-forest text-forest hover:bg-forest hover:text-white px-7 py-3 rounded-md text-sm font-semibold transition-colors">
                Explore More
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative min-h-[300px] md:min-h-[400px]">
            <Image
              src={slide.image}
              alt="Featured phones and accessories"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Discount Badge */}
          <div className="absolute top-0 right-4 md:top-2 md:right-8 w-20 h-20 bg-gray-900 rounded-full flex flex-col items-center justify-center text-white z-20">
            <span className="text-xl font-bold leading-none">{slide.discount}</span>
            <span className="text-xs mt-0.5">Off</span>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === current ? "bg-forest" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
