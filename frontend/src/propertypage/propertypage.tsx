import React from 'react';
import SearchBar from '../components/search-bar';

const PropertyPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <p>Property Page</p>
      <div
        style={{ width: '60%', backgroundColor: '#f0f0f0', padding: '20px' }}
      >
        <div style={{ width: '100%' }}>
          <SearchBar />
        </div>
      </div>
      <div
        style={{ width: '40%', backgroundColor: '#e0e0e0', padding: '20px' }}
      >
        Right Div (40%)
      </div>
    </div>
  );
};

export default PropertyPage;
