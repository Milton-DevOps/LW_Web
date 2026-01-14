'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Sign up to our newsletter</h4>
            <p className="text-xs text-gray-500 mb-3">I'm interested in</p>
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center text-xs gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>News</span>
              </label>
              <label className="flex items-center text-xs gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span>More</span>
              </label>
            </div>

            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                aria-label="Email address"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Email address"
              />
              <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded">Submit</button>
            </form>

            <p className="text-xs text-gray-400 mt-4">Clara & Team Ltd. Done by Agency</p>
          </div>

          {/* Center: App badges + benefits */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <img src="/appstore-badge.svg" alt="App Store" className="h-12 inline-block mr-2" />
              <img src="/playstore-badge.svg" alt="Google Play" className="h-12 inline-block" />
            </div>

            <div className="text-xs text-gray-600 max-w-md">
              <p className="font-semibold">15% Off your first order</p>
              <p className="mt-1">Subscribe to our mailing list for 15% off your first order</p>
              <p className="mt-3">45 Day Returns · Free Worldwide Delivery on orders over £70</p>
            </div>
          </div>

          {/* Right: Socials / Info */}
          <div className="flex flex-col md:items-end">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-semibold mb-2">Socials</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><a className="hover:text-gray-900" href="#">Instagram</a></li>
                  <li><a className="hover:text-gray-900" href="#">TikTok</a></li>
                  <li><a className="hover:text-gray-900" href="#">YouTube</a></li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold mb-2">Info</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><Link href="/returns" className="hover:text-gray-900">Returns</Link></li>
                  <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-400">© {year} Light World Mission</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;