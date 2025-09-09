import React, { useState, useEffect } from 'react';
import SearchBar from '../components/property-search-bar';
import PropertyCard from '../components/property-card';

interface Property {
  name: string;
  per_night_price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
}

const PropertyPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8000/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data.properties);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="w-full h-screen">
      <div className="flex w-full h-full">
        <div className="w-3/5 bg-gray-100 overflow-auto p-2.5 pb-2.5 relative">
          <div className="sticky z-10 bg-gray-100 top-0 mb-5">
            <SearchBar />
          </div>
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4">
              {properties.map((property, index) => (
                <PropertyCard key={index} property={property} />
              ))}
            </div>
          )}
        </div>
        <div className="w-2/5 bg-gray-300 p-5 overflow-auto">
          Map
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
