import React from 'react';
import SearchBar from '../components/homepage-search-bar';

const Search: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <img
        src="https://img.freepik.com/free-photo/3d-rendering-beautiful-luxury-bedroom-suite-hotel-with-working-table_105762-2154.jpg"
        alt="3d rendering beautiful luxury bedroom suite in hotel with working table"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 z-10">
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-8">
          <div className="text-white text-8xl font-bold text-left leading-tight">
            Book
            <br />
            Beautiful Stays
          </div>
        </div>
        <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-8">
          <SearchBar style={{ marginTop: '-64px' }} />
        </div>
      </div>
    </div>
  );
};

export default Search;
