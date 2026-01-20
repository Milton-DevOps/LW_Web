import React from 'react';
import { Button } from './Button';

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'planned';
  image?: string;
  progress?: number;
  startDate: string;
  endDate?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  category,
  status,
  image,
  progress = 0,
  startDate,
  endDate,
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'planned':
        return 'Planned';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Project Image */}
      {image ? (
        <div className="relative w-full h-48 sm:h-52 bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 sm:h-52 bg-gray-300 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
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

      {/* Project Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        {/* Category and Status */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1.5 whitespace-nowrap">
            {category}
          </span>
          <span
            className={`text-xs font-semibold text-white px-2.5 py-1.5 whitespace-nowrap ${
              status === 'active'
                ? 'bg-green-600'
                : status === 'completed'
                ? 'bg-blue-600'
                : 'bg-yellow-500'
            }`}
          >
            {getStatusLabel(status)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Progress</span>
              <span className="text-xs font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-[#cb4154] h-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Date Range */}
        <div className="flex items-center text-xs text-gray-500 space-x-2 mb-4 sm:mb-5">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">
            {formatDate(startDate)}
            {endDate && ` - ${formatDate(endDate)}`}
          </span>
        </div>

        {/* View Details Button */}
        <Button variant="secondary" fullWidth className="mt-auto">
          View Details
        </Button>
      </div>
    </div>
  );
};
