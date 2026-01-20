'use client';

import { useState, useEffect, useRef } from 'react';
import { Carousel, Navbar, Button, ProjectModal, AllProjectsModal } from "@/components";
import Footer from "@/components/Footer";
import Image from "next/image";
import { ProjectCard } from "@/components/ProjectCard";
import { churchProjectService, ChurchProject } from "@/services/churchProjectService";

export default function Home() {
  const [projects, setProjects] = useState<ChurchProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ChurchProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);
  const projectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Fetch church projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectsError(null);
        const response = await churchProjectService.getChurchProjects({ limit: 6 });
        if (response.success && response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjectsError(error instanceof Error ? error.message : 'Failed to load projects');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Auto-rotate project cards
  useEffect(() => {
    if (!projects.length) return;

    if (projectTimeoutRef.current) {
      clearTimeout(projectTimeoutRef.current);
    }

    projectTimeoutRef.current = setTimeout(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => {
      if (projectTimeoutRef.current) {
        clearTimeout(projectTimeoutRef.current);
      }
    };
  }, [currentProjectIndex, projects.length]);

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToProject = (index: number) => {
    setCurrentProjectIndex(index);
  };

  const handleLearnMore = (project: ChurchProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Carousel items={carouselItems} />

        {/* Church Projects Section - Carousel View */}
        {projects.length > 0 && (
          <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Church Projects
                </h2>
                <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Discover our ongoing initiatives and the impact we're making in our community.
                </p>
              </div>

              {/* Project Carousel Container */}
              <div className="relative">
                {/* Main Project Card - Large Display */}
                <div className="relative mb-8 sm:mb-10">
                  <div className="bg-white shadow-md overflow-hidden">
                    {projects.map((project, index) => (
                      <div
                        key={project._id}
                        className={`
                          transition-opacity duration-500 ease-in-out
                          ${index === currentProjectIndex ? 'opacity-100' : 'opacity-0 hidden'}
                        `}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          {/* Project Image */}
                          <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-200 overflow-hidden">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                <svg
                                  className="w-24 h-24 text-gray-400"
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
                          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                            {/* Category and Status */}
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5">
                                  {project.category}
                                </span>
                                <span
                                  className="text-xs font-semibold text-white px-3 py-1.5"
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

                              {/* Title */}
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {project.title}
                              </h3>

                              {/* Description */}
                              <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                                {project.description}
                              </p>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
                                <div>
                                  <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Start Date</p>
                                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    {new Date(project.startDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </p>
                                </div>
                                {project.endDate && (
                                  <div>
                                    <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">End Date</p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                                      {new Date(project.endDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </p>
                                  </div>
                                )}
                                {project.budget && (
                                  <div>
                                    <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Budget</p>
                                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                                      ${project.budget.toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Progress Bar */}
                              {project.progress !== undefined && (
                                <div className="mb-6">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Progress</p>
                                    <p className="text-xs font-bold text-gray-900">{project.progress}%</p>
                                  </div>
                                  <div className="w-full bg-gray-200 h-2">
                                    <div
                                      className="bg-[#cb4154] h-full transition-all duration-300"
                                      style={{ width: `${project.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Learn More Button */}
                            <Button 
                              fullWidth 
                              variant="primary"
                              onClick={() => handleLearnMore(projects[currentProjectIndex])}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows - Responsive */}
                  {projects.length > 1 && (
                    <>
                      <button
                        onClick={prevProject}
                        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 z-20 p-2 bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 items-center justify-center"
                        aria-label="Previous project"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={nextProject}
                        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 z-20 p-2 bg-white shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 items-center justify-center"
                        aria-label="Next project"
                      >
                        <svg
                          className="w-6 h-6 text-gray-800"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Project Indicators/Thumbnails */}
                {projects.length > 1 && (
                  <div className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto">
                    {projects.map((project, index) => (
                      <button
                        key={project._id}
                        onClick={() => goToProject(index)}
                        className={`
                          flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden border-2 transition-all duration-300
                          ${
                            index === currentProjectIndex
                              ? 'border-[#cb4154] shadow-md'
                              : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                        aria-label={`Go to project ${index + 1}`}
                      >
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* View All Button */}
                <div className="text-center">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="inline-block"
                    onClick={() => setIsAllProjectsModalOpen(true)}
                  >
                    View All Projects
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Pastor Message Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="order-2 md:order-1">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  A Message From Our Pastor
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed font-medium">
                  Beloved,
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                  God has called us into a season of building — not just walls, but destinies. 
                  Our current space can no longer contain what God is doing among us. This 
                  new church building will be a place where families grow, children are 
                  nurtured, the lost are saved, and the glory of God transforms lives.
                </p>
                
                <div className="border-l-4 border-[#cb4154] pl-5 sm:pl-6 my-6 sm:my-8 py-2">
                  <p className="text-base sm:text-lg text-gray-700 italic mb-3 font-medium">
                    "Go up to the mountain and bring wood, and build the house; and I will 
                    take pleasure in it, and I will be glorified."
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">— Haggai 1:8</p>
                </div>

                <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                  We invite you to join hands with us in faith, sacrifice, and generosity as 
                  we build a sanctuary for generations to come.
                </p>

                <div className="pt-4">
                  <p className="font-bold text-base sm:text-lg text-gray-900">General Overseer, Light World Mission Int'l</p>
                  <p className="text-gray-700 text-base sm:text-lg mt-1">Rev. Dr. Nsame Leslie Nfor</p>
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
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature cards */}
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Project Detail Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />

      {/* All Projects Modal */}
      <AllProjectsModal
        projects={projects}
        isOpen={isAllProjectsModalOpen}
        onClose={() => setIsAllProjectsModalOpen(false)}
      />
    </div>
  );
}