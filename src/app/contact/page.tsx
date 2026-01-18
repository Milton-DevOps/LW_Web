'use client';

import { Carousel, Navbar } from '@/components'
import Footer from '@/components/Footer'
import React from 'react'

function ContactPage() {
  const carouselItems = [
    {
      id: 1,
      image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23cb4154;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%237e8ba3;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='400' fill='url(%23grad1)'/%3E%3Ccircle cx='200' cy='150' r='60' fill='%23ffffff' opacity='0.2'/%3E%3Ccircle cx='600' cy='250' r='80' fill='%23ffffff' opacity='0.15'/%3E%3Ctext x='400' y='180' font-size='48' font-weight='bold' fill='%23ffffff' text-anchor='middle'%3EGet In Touch%3C/text%3E%3Ctext x='400' y='220' font-size='24' fill='%23ffffff' text-anchor='middle' opacity='0.9'%3EWe'd love to hear from you%3C/text%3E%3C/svg%3E`,
      title: '',
      description: ''
    }
  ];

  // WhatsApp phone number - replace with your actual number (with country code, no + or spaces)
  const whatsappNumber = '1234567890'; // Example: 12345678900 for +1 234 567 8900
  const whatsappMessage = encodeURIComponent('Hello! I would like to get in touch with Light World Mission.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Carousel Section */}
        <Carousel items={carouselItems} autoPlay={true} autoPlayInterval={8000} />

        {/* Contact Section */}
        <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - WhatsApp CTA */}
            <div className="flex flex-col justify-center items-start">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Connect With Us
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                Have a question or want to learn more about Light World Mission? 
                Get in touch with us via WhatsApp for a quick and convenient conversation.
              </p>
              
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5E] text-white font-semibold py-4 px-6 sm:py-5 sm:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {/* WhatsApp Icon */}
                <svg 
                  className="w-6 h-6 sm:w-7 sm:h-7" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.022 0-2.031.193-3.002.568-.97.375-1.84.924-2.57 1.654-.73.73-1.28 1.6-1.654 2.57-.376.971-.569 1.98-.569 3.002 0 1.022.193 2.031.568 3.002.374.97.923 1.84 1.654 2.57.73.73 1.6 1.28 2.57 1.654.971.375 1.98.568 3.002.568 1.021 0 2.031-.193 3.002-.568.97-.375 1.84-.924 2.57-1.654.73-.73 1.28-1.6 1.654-2.57.375-.971.568-1.98.568-3.002 0-1.022-.193-2.031-.568-3.002-.374-.97-.924-1.84-1.654-2.57-.73-.73-1.6-1.28-2.57-1.654-.971-.375-1.981-.568-3.002-.568Z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>

              <p className="text-sm text-gray-500 mt-6">
                ⏱️ We typically respond within a few minutes
              </p>
            </div>

            {/* Right Side - Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Why Contact Us?
                </h3>
                <p className="text-gray-600 mb-4">
                  We are here to help and answer any questions you might have about our ministry and services.
                </p>
              </div>

              {/* Contact Info Items */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#cb4154] text-white flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600 text-sm mt-1">contact@lightworldmission.org</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#cb4154] text-white flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600 text-sm mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#cb4154] text-white flex-shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600 text-sm mt-1">Visit us at our main office</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Response</h4>
                <p className="text-gray-600 text-sm">
                  Our team is available on WhatsApp to answer your questions quickly and provide any assistance you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage