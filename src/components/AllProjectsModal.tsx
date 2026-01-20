'use client';

import { useState, useMemo } from 'react';
import { ChurchProject } from '@/services/churchProjectService';
import { Button, Input } from './index';
import { ProjectModal } from './ProjectModal';

interface AllProjectsModalProps {
  projects: ChurchProject[];
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS_PER_PAGE = 5;

// Responsive breakpoints for AllProjectsModal
// Mobile-first: optimize for mobile, then enhance for larger screens

export function AllProjectsModal({ projects, isOpen, onClose }: AllProjectsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'planned'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ChurchProject | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map(p => p.category)));
    return cats.sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchQuery, filterStatus, filterCategory]);

  // Paginate projects
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  const handleLearnMore = (project: ChurchProject) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div
          className="bg-white w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="all-projects-title"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 z-20">
            <div className="flex justify-between items-start gap-3 mb-4 sm:mb-6">
              <h2 id="all-projects-title" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 flex-1">
                All Projects
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex-shrink-0"
                aria-label="Close modal"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                fullWidth
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Status
                </label>
                <select
                  aria-label="Filter by Status"
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(() => setFilterStatus(e.target.value as any))}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 bg-white focus:border-[#cb4154] focus:ring-2 focus:ring-[#cb4154] focus:ring-opacity-10 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="planned">Planned</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  Category
                </label>
                <select
                  aria-label="Filter by Category"
                  value={filterCategory}
                  onChange={(e) => handleFilterChange(() => setFilterCategory(e.target.value))}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 bg-white focus:border-[#cb4154] focus:ring-2 focus:ring-[#cb4154] focus:ring-opacity-10 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              Showing {paginatedProjects.length} of {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">
            {paginatedProjects.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {paginatedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                      {/* Project Image */}
                      <div className="relative w-full h-40 sm:h-48 md:h-full bg-gray-200 overflow-hidden">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Project Details */}
                      <div className="md:col-span-2 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
                        {/* Header Info */}
                        <div>
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 sm:py-1">
                              {project.category}
                            </span>
                            <span
                              className="text-xs font-semibold text-white px-2 py-0.5 sm:py-1"
                              style={{
                                backgroundColor:
                                  project.status === 'active'
                                    ? '#27ae60'
                                    : project.status === 'completed'
                                      ? '#3498db'
                                      : '#f39c12',
                              }}
                            >
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                            {project.title}
                          </h3>

                          <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Quick Info */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div>
                              <p className="text-xs text-gray-600 font-semibold mb-0.5 sm:mb-1 uppercase">Start</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                {new Date(project.startDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            {project.budget && (
                              <div>
                                <p className="text-xs text-gray-600 font-semibold mb-0.5 sm:mb-1 uppercase">Budget</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                  ${project.budget.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {project.progress !== undefined && (
                              <div>
                                <p className="text-xs text-gray-600 font-semibold mb-0.5 sm:mb-1 uppercase">Progress</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{project.progress}%</p>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {project.progress !== undefined && (
                            <div className="mb-3 sm:mb-4">
                              <div className="w-full bg-gray-200 h-1.5">
                                <div
                                  className="bg-[#cb4154] h-full transition-all duration-300"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleLearnMore(project)}
                          className="w-full md:w-auto text-xs sm:text-sm"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <svg
                  className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-3 sm:mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1.5 sm:mb-2">No projects found</p>
                <p className="text-xs sm:text-sm text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                </p>

                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center sm:justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                  >
                    Prev
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex gap-0.5 sm:gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
                          px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors duration-200
                          ${
                            page === currentPage
                              ? 'bg-[#cb4154] text-white'
                              : 'bg-white text-gray-900 border border-gray-300 hover:border-[#cb4154] hover:text-[#cb4154]'
                          }
                        `}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </>
  );
}
