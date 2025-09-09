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
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{ 
            width: '60%', 
            backgroundColor: '#f0f0f0', 
            overflow: 'auto',
            padding: '0 10px 10px 10px',
            position: 'relative'
          }}
        >
          <div style={{ 
            position: 'sticky',
            zIndex: 10, 
            backgroundColor: '#f0f0f0',
            top: '0px',
            marginBottom: '20px'
          }}>
            <SearchBar />
          </div>
          {!loading && !error && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {properties.map((property, index) => (
                <PropertyCard key={index} property={property} />
              ))}
            </div>
          )}
        </div>
        <div
          style={{ 
            width: '40%', 
            backgroundColor: '#e0e0e0', 
            padding: '20px',
            overflow: 'auto'
          }}
        >
          Map
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
