'use client';

import { Carousel, Navbar } from "@/components";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  const carouselItems = [
    {
      id: 1,
      image: '/App images/10x better.jpg',
      title: 'Experience a Better Life',
      description: 'Join us on a journey of growth and spiritual transformation',
    },
    {
      id: 2,
      image: '/App images/PLCrusade.jpg',
      title: 'Join Our Community',
      description: 'Build meaningful connections and grow together',
    },
    {
      id: 3,
      image: '/App images/PLCrusade2.jpg',
      title: 'Transform Your Life',
      description: 'Discover your purpose and potential',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Carousel items={carouselItems} />

        {/* Pastor Message Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Text Content */}
              <div className="order-2 md:order-1">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  A Message From Our Pastor
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                  Beloved,
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                  God has called us into a season of building — not just walls, but destinies. 
                  Our current space can no longer contain what God is doing among us. This 
                  new church building will be a place where families grow, children are 
                  nurtured, the lost are saved, and the glory of God transforms lives.
                </p>
                
                <blockquote className="border-l-4 border-[#cb4154] pl-4 my-6 italic text-gray-700">
                  <p className="text-lg mb-2">
                    "Go up to the mountain and bring wood, and build the house; and I will 
                    take pleasure in it, and I will be glorified."
                  </p>
                  <p className="text-sm font-semibold">— Haggai 1:8</p>
                </blockquote>

                <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                  We invite you to join hands with us in faith, sacrifice, and generosity as 
                  we build a sanctuary for generations to come.
                </p>

                <div className="mt-8">
                  <p className="font-bold text-lg text-gray-900">General Overseer, Light World Mission Int'l</p>
                  <p className="text-gray-700">— Rev. Dr. Nsame Leslie Nfor</p>
                </div>
              </div>

              {/* Pastor Image */}
              <div className="order-1 md:order-2 flex justify-center md:justify-end">
                <div className="relative w-full max-w-sm">
                  <img
                    src="/App images/PL no background.png"
                    alt="Rev. Dr. Nsame Leslie Nfor"
                    className="w-full h-auto object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature cards */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
