'use client';

import React, { useState, useEffect } from 'react';
import { Carousel, Navbar } from '@/components';
import Footer from '@/components/Footer';
import styles from '../pages.module.css';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch books from backend
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`);
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <Carousel items={[{
          id: 1,
          image: 'data:image/svg+xml,%3Csvg...',
          title: 'Our Books',
          description: 'Explore our collection of inspiring books'
        }]} />

        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">Books</h1>
          <p className="text-gray-600 text-base sm:text-lg mb-8">
            Explore our inspiring collection of books.
          </p>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading books...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {books.map((book: any) => (
                <div key={book._id} className="flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 sm:h-56 bg-gray-200">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 flex-1">{book.description}</p>
                    <button className="mt-4 w-full bg-[#cb4154] text-white py-2 rounded text-sm sm:text-base hover:bg-[#b8364b]">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}