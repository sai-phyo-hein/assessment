import React from 'react';
import SearchBar from '../components/search-bar';

const Search: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        src="https://img.freepik.com/free-photo/3d-rendering-beautiful-luxury-bedroom-suite-hotel-with-working-table_105762-2154.jpg"
        alt="3d rendering beautiful luxury bedroom suite in hotel with working table"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: '6rem',
              fontWeight: 'bold',
              textAlign: 'left',
              lineHeight: '1.1',
            }}
          >
            Book
            <br />
            Beautiful Stays
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
          }}
        >
          <SearchBar style={{ marginTop: '-64px' }} />
        </div>
      </div>
    </div>
  );
};

export default Search;
