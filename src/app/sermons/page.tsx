'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { colors } from '../../constants/colors';
import { liveStreamService } from '../../services/liveStreamService';
import { sermonService } from '../../services/sermonService';
import styles from '../pages.module.css';

interface LiveStream {
  _id: string;
  title: string;
  description: string;
  host: string;
  startTime: string;
  streamUrl: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  viewers: number;
  category: string;
}

interface Sermon {
  _id: string;
  title: string;
  description: string;
  mainSpeaker: string;
  datePreached: string;
  videoUrl: string;
  duration: number;
  views: number;
  series?: string;
  tags?: string[];
  status: string;
  thumbnail?: string;
}

export default function Sermons() {
  const [activeLiveStream, setActiveLiveStream] = useState<LiveStream | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [showLiveNotification, setShowLiveNotification] = useState(false);
  const itemsPerPage = 6;

  // Function to fetch sermons
  const fetchSermons = async () => {
    try {
      const response = await sermonService.getSermons({ status: 'published' });
      if (response.success && response.data) {
        setSermons(response.data);
        setFilteredSermons(response.data);
      }
    } catch (err) {
      setError('Failed to load sermons');
      console.error('Error fetching sermons:', err);
    }
  };

  // Fetch live stream with polling and auto-save logic
  useEffect(() => {
    const fetchActiveLiveStream = async () => {
      try {
        // Fetch current live streams
        const liveResponse = await liveStreamService.getLiveStreams({ status: 'live' });
        console.log('Live stream response:', liveResponse);
        
        if (liveResponse.success && liveResponse.data && liveResponse.data.length > 0) {
          const newLiveStream = liveResponse.data[0];
          console.log('Live stream found:', newLiveStream);
          
          // Show notification if this is a new live stream
          if (!activeLiveStream && newLiveStream) {
            setShowLiveNotification(true);
            console.log('Showing notification for new stream');
            // Auto-hide notification after 5 seconds
            setTimeout(() => setShowLiveNotification(false), 5000);
          }
          setActiveLiveStream(newLiveStream);
        } else {
          console.log('No live streams found');
          // Check if there's an active live stream that has ended
          if (activeLiveStream) {
            try {
              // Try to save the ended stream as a sermon
              console.log(`Live stream ${activeLiveStream._id} has ended. Attempting to save as sermon...`);
              await liveStreamService.saveStreamAsSermon(activeLiveStream._id);
              console.log(`Successfully saved live stream as sermon`);
              // Refresh sermons list to show the newly saved sermon
              fetchSermons();
            } catch (err) {
              console.error('Error saving stream as sermon:', err);
            }
          }
          setActiveLiveStream(null);
        }
      } catch (err) {
        console.error('Error fetching live stream:', err);
      }
    };

    // Fetch immediately
    fetchActiveLiveStream();

    // Poll every 10 seconds to check for new live streams
    const interval = setInterval(fetchActiveLiveStream, 10000);

    return () => clearInterval(interval);
  }, [activeLiveStream]);

  // Fetch sermons on component mount
  useEffect(() => {
    setLoading(true);
    fetchSermons().finally(() => setLoading(false));
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filtered = sermons;

    // Apply filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((sermon) => sermon.series === selectedFilter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(query) ||
          sermon.mainSpeaker.toLowerCase().includes(query) ||
          sermon.series?.toLowerCase().includes(query)
      );
    }

    setFilteredSermons(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, sermons]);

  // Get unique series for filter dropdown
  const seriesList = Array.from(new Set(sermons.map((s) => s.series).filter(Boolean)));

  // Paginate filtered sermons
  const paginatedSermons = filteredSermons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSermons.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${styles.bgSurface} min-h-screen flex flex-col`}>
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className={`${styles.textDark} text-4xl font-bold mb-4`}>Sermons</h1>
            <p className={`${styles.textSecondary} text-lg max-w-2xl mx-auto`}>
              Listen to inspiring sermons from our spiritual leaders and expand your spiritual journey.
            </p>
          </div>

          {/* Live Stream Section */}
          {activeLiveStream && (
            <div className="mb-16" data-live-stream>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 border border-white/10 backdrop-blur-xl">
                {/* Live Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-bold">LIVE NOW</span>
                  </div>
                </div>

                {/* Viewers Count */}
                <div className="absolute top-4 right-4 z-10 bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                  <p className="text-white text-sm">
                    👥 {activeLiveStream.viewers?.toLocaleString() || 0} viewers
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
                  {/* Video Player */}
                  <div className="lg:col-span-2">
                    <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`${activeLiveStream.streamUrl}${activeLiveStream.streamUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1`}
                        title={activeLiveStream.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Stream Info */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-3">{activeLiveStream.title}</h2>
                      <p className="text-gray-300 mb-4">{activeLiveStream.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold text-white">Host:</span> {activeLiveStream.host}
                        </p>
                        {activeLiveStream.category && (
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold text-white">Category:</span>{' '}
                            {activeLiveStream.category}
                          </p>
                        )}
                        <p className="text-sm text-gray-400">
                          <span className="font-semibold text-white">Started:</span>{' '}
                          {formatDate(activeLiveStream.startTime)}
                        </p>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth className="mt-6">
                      Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search sermons by title, speaker, or series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  className="pl-12"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter Dropdown */}
              <div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-[#cb4154] transition-colors"
                  title="Filter by series"
                >
                  <option value="all">All Sermons</option>
                  {seriesList.map((series) => (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{paginatedSermons.length}</span> of{' '}
              <span className="font-semibold">{filteredSermons.length}</span> sermons
            </div>
          </div>

          {/* Sermons Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cb4154]"></div>
              </div>
              <p className={`${styles.textSecondary} mt-4`}>Loading sermons...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <p className={`${styles.textSecondary} text-lg`}>No sermons found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedSermons.map((sermon) => (
                  <div
                    key={sermon._id}
                    className="group rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden bg-black h-48">
                      {sermon.thumbnail ? (
                        <img
                          src={sermon.thumbnail}
                          alt={sermon.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#cb4154] to-[#e09510] flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          className="rounded-full bg-[#cb4154] p-4 hover:bg-[#a83444] transition-colors"
                          title="Play sermon"
                        >
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>

                      {/* Duration Badge */}
                      {sermon.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs font-semibold">
                          {formatDuration(sermon.duration)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {sermon.series && (
                        <p className="text-xs font-semibold text-[#cb4154] uppercase mb-2">{sermon.series}</p>
                      )}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#cb4154] transition-colors">
                        {sermon.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">by <span className="font-semibold">{sermon.mainSpeaker}</span></p>
                      <p className="text-xs text-gray-500 mb-4">{formatDate(sermon.datePreached)}</p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
                        <span>👁️ {sermon.views?.toLocaleString() || 0} views</span>
                      </div>

                      {/* Tags */}
                      {sermon.tags && sermon.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {sermon.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Play Button */}
                      <Button 
                        variant="primary" 
                        fullWidth 
                        size="sm"
                        onClick={() => setSelectedSermon(sermon)}
                      >
                        Play Sermon
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-12">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    ← Previous
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-[#cb4154] text-white font-semibold'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-[#cb4154]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Video Player Modal */}
      {selectedSermon && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSermon(null)}
        >
          <div 
            className="bg-black rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setSelectedSermon(null)}
                className="text-white hover:text-gray-300 transition-colors"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div className="bg-black relative w-full" style={{ paddingBottom: '56.25%' }}>
              {selectedSermon.videoUrl ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={selectedSermon.videoUrl}
                  title={selectedSermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black text-white">
                  <p className="text-lg">Video URL not available</p>
                </div>
              )}
            </div>

            {/* Sermon Info */}
            <div className="bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedSermon.title}</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold">Speaker:</span> {selectedSermon.mainSpeaker}</p>
                <p><span className="font-semibold">Date:</span> {formatDate(selectedSermon.datePreached)}</p>
                {selectedSermon.series && <p><span className="font-semibold">Series:</span> {selectedSermon.series}</p>}
                {selectedSermon.description && <p className="mt-4">{selectedSermon.description}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Stream Notification */}
      {showLiveNotification && activeLiveStream && (
        <div className="fixed bottom-8 right-8 bg-red-600 text-white rounded-lg shadow-2xl p-4 z-40 animate-pulse max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <p className="font-bold text-lg">🔴 LIVE NOW!</p>
              <p className="text-sm">{activeLiveStream.title}</p>
              <p className="text-xs mt-1 opacity-90">Hosted by {activeLiveStream.host}</p>
            </div>
            <button
              onClick={() => setShowLiveNotification(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <button
            onClick={() => {
              setShowLiveNotification(false);
              // Scroll to live stream section
              document.querySelector('[data-live-stream]')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full mt-3 bg-white text-red-600 font-bold py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Watch Live
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
