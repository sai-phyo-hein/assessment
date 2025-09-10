import React from 'react';

interface StarProps {
  filled: boolean;
  className?: string;
  onClick?: () => void;
}

const Star: React.FC<StarProps> = ({ filled, className = '', onClick }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onClick={onClick}
    style={onClick ? { cursor: 'pointer' } : {}}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.275 9.397c-.784-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
);

export default Star;