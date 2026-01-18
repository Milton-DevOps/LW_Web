'use client';

import { Carousel, Navbar } from '@/components'
import Footer from '@/components/Footer'
import React from 'react'

function AboutPage() {
  const carouselItems = [
    {
      id: 1,
      image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23cb4154;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%237e8ba3;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='400' fill='url(%23grad1)'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='600' cy='250' r='80' fill='%23ffffff' opacity='0.15'/%3E%3Ctext x='400' y='180' font-size='48' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3EGet In Touch%3C/text%3E%3Ctext x='400' y='220' font-size='24' fill='%23ffffff' text-anchor='middle' opacity='0.9'%3EWe'd love to hear from you%3C/text%3E%3C/svg%3E`,
      title: '',
      description: ''
    }
  ];



  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Carousel Section */}
        <Carousel items={carouselItems} autoPlay={true} autoPlayInterval={8000} />

      </main>

      <Footer />
    </div>
  )
}

export default AboutPage;