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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          backgroundColor: '#f0f0f0',
          borderRadius: '30px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease',
          zIndex: hoveredIndex === index ? 10 : 1,
          cursor: hoveredIndex === index ? 'pointer' : 'default',
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={handleImageClick}
      >
        <img
          src={imageSrc}
          alt={altText}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '30px',
            transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          fontSize: '1.1rem',
          color: '#333',
          textAlign: 'center',
        }}
      >
        {cityName}
      </div>
    </div>
  );
};

export default LocationCard;
