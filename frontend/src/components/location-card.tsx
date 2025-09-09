import React from 'react';
import { useAppStore } from '../global-store';

interface LocationCardProps {
  imageSrc: string;
  altText: string;
  cityName: string;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  imageSrc,
  altText,
  cityName,
  index,
  hoveredIndex,
  setHoveredIndex,
}) => {
  const { setShowPropertyPage } = useAppStore();

  const handleImageClick = () => {
    setShowPropertyPage(true);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-full aspect-square bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center transition-transform duration-300 ease-in-out ${
          hoveredIndex === index 
            ? 'scale-105 z-10 cursor-pointer' 
            : 'scale-100 z-[1] cursor-default'
        }`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={handleImageClick}
      >
        <img
          src={imageSrc}
          alt={altText}
          className={`w-full h-full object-cover rounded-3xl transition-transform duration-300 ease-in-out ${
            hoveredIndex === index ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>
      <div className="text-lg text-gray-800 text-center">
        {cityName}
      </div>
    </div>
  );
};

export default LocationCard;
