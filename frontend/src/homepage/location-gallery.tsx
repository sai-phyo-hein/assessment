import React, { useState } from 'react';
import LocationCard from './location-card';

const LocationGallery: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const locations = [
    {
      imageSrc:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg',
      altText: 'London Skyline',
      cityName: 'LONDON',
    },
    {
      imageSrc:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Alger-Place-des-Martyrs-Casbah_cropped.jpg/330px-Alger-Place-des-Martyrs-Casbah_cropped.jpg',
      altText: 'Algiers Skyline',
      cityName: 'ALGIERS',
    },
    {
      imageSrc:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/960px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
      altText: 'Paris Eiffel Tower',
      cityName: 'PARIS',
    },
    {
      imageSrc:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Lisbon_%2836831596786%29_%28cropped%29.jpg/960px-Lisbon_%2836831596786%29_%28cropped%29.jpg',
      altText: 'Lisbon Skyline',
      cityName: 'LISBON',
    },
  ];

  return (
    <div>
      <h1 className="text-6xl text-black text-center my-16 font-bold">
        Furnished apartments in top locations
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-[95%] mx-auto mb-16 leading-relaxed">
        The Flex apartments are designed with you in mind – all you have to do
        is unpack your bags and start living. With flexible terms and seamless
        service, we offer move-in ready apartments across top cities around the
        globe. Stay for days, weeks or months, and leave when it suits you.
      </p>
      <div className="grid grid-cols-2 gap-20 max-w-4xl mx-auto mb-24 px-8">
        {locations.map((location, index) => (
          <LocationCard
            key={index}
            imageSrc={location.imageSrc}
            altText={location.altText}
            cityName={location.cityName}
            index={index}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationGallery;
