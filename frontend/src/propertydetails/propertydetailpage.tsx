import React from 'react';
import Gallery from './gallery';

interface Image {
  src: string;
  alt: string;
  type: string;
}

const PropertyDetailPage: React.FC = () => {
  // Sample images for the gallery
  const images: Image[] = [
    { src: '/images/property1.jpg', alt: 'Property main image', type: 'main' },
    { src: '/images/property2.jpg', alt: 'Property bedroom', type: 'bedroom' },
    { src: '/images/property3.jpg', alt: 'Property living room', type: 'living' },
    { src: '/images/property4.jpg', alt: 'Property kitchen', type: 'kitchen' },
    { src: '/images/property5.jpg', alt: 'Property bathroom', type: 'bathroom' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Details</h1>
      <Gallery images={images} />
      {/* Add more property details here */}
    </div>
  );
};

export default PropertyDetailPage;
