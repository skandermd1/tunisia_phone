"use client";

import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";

const products = [
  {
    name: "iPhone 16 Pro Max",
    price: "4299",
    originalPrice: "4799",
    rating: 4.8,
    reviews: 124,
    image: "/images/hero-1.png",
    badge: "New",
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    price: "3899",
    originalPrice: "4399",
    rating: 4.7,
    reviews: 98,
    image: "/images/hero-2.png",
    badge: "Hot",
  },
  {
    name: "AirPods Pro 3",
    price: "899",
    originalPrice: "1099",
    rating: 4.9,
    reviews: 256,
    image: "/images/hero-1.png",
    badge: "-18%",
  },
  {
    name: "65W GaN Fast Charger",
    price: "149",
    originalPrice: "249",
    rating: 4.6,
    reviews: 87,
    image: "/images/hero-2.png",
    badge: "-40%",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <a
            href="#"
            className="text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-forest transition-colors"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.name}
              className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-forest text-white text-xs font-semibold px-2.5 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price} <span className="text-xs">TND</span>
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  </div>
                  <button className="w-9 h-9 bg-forest hover:bg-forest-light text-white rounded-lg flex items-center justify-center transition-colors">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
