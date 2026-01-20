'use client';

import { ChurchProject } from '@/services/churchProjectService';
import { Button } from './index';
import React from 'react';

interface ProjectModalProps {
  project: ChurchProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen || !project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="sticky top-0 right-0 p-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 float-right z-10"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

          {/* Modal Content */}
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Project Image */}
            {project.image && (
              <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-200 overflow-hidden mb-8">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Category and Status */}
            <div className="flex items-center gap-3 mb-6">
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
            <h2 id="modal-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {project.title}
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-base sm:text-lg mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {/* Start Date */}
              <div className="border-l-4 border-[#cb4154] pl-4">
                <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                  Start Date
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {new Date(project.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* End Date */}
              {project.endDate && (
                <div className="border-l-4 border-[#7e8ba3] pl-4">
                  <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                    End Date
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    {new Date(project.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {/* Budget */}
              {project.budget && (
                <div className="border-l-4 border-[#f5a623] pl-4">
                  <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                    Budget
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    ${project.budget.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Created By */}
              <div className="border-l-4 border-gray-300 pl-4">
                <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                  Created By
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {project.createdBy?.firstName} {project.createdBy?.lastName}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {project.progress !== undefined && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                    Project Progress
                  </p>
                  <p className="text-sm font-bold text-gray-900">{project.progress}%</p>
                </div>
                <div className="w-full bg-gray-200 h-3">
                  <div
                    className="bg-[#cb4154] h-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-50 p-6 mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Project Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                    Created Date
                  </p>
                  <p className="text-base text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">
                    Last Updated
                  </p>
                  <p className="text-base text-gray-900">
                    {new Date(project.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button fullWidth variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
