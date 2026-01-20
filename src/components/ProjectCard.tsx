import React from 'react';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#27ae60';
      case 'completed':
        return '#3498db';
      case 'planned':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Project Image */}
      {image ? (
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-500"
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
      <div className="p-5 sm:p-6">
        {/* Category and Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {category}
          </span>
          <span
            className="text-xs font-semibold text-white px-3 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(status) }}
          >
            {getStatusLabel(status)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">Progress</span>
              <span className="text-xs font-bold text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Date Range */}
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          <svg
            className="w-4 h-4"
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
          <span>
            {formatDate(startDate)}
            {endDate && ` - ${formatDate(endDate)}`}
          </span>
        </div>

        {/* View Details Button */}
        <button className="w-full mt-5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors duration-200">
          View Details
        </button>
      </div>
    </div>
  );
};
