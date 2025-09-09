import React, { useState } from 'react';
import { MapPin, Plus, Minus } from 'lucide-react';
import Dropdown from './dropdown';

interface SearchBarProps {
  style?: React.CSSProperties;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ style, className = '' }) => {
  const [selectedCity, setSelectedCity] = useState('City');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const cities = [
    'London',
    'Paris',
    'New York',
    'Tokyo',
    'Sydney',
    'Berlin',
    'Rome',
    'Barcelona',
  ];

  const handleGuestChange = (increment: boolean) => {
    if (increment) {
      setGuests((prev) => Math.min(prev + 1, 10)); // Max 10 guests
    } else {
      setGuests((prev) => Math.max(prev - 1, 1)); // Min 1 guest
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-xl p-4 max-w-6xl mx-auto relative z-20 ${className}`}
      style={style}
    >
      <div className="flex items-end gap-4">
        {/* City Selection */}
        <div className="flex flex-col flex-1">
          <Dropdown
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities.map((city) => ({
              value: city,
              label: (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2 text-gray-500" />
                  {city}
                </div>
              ),
            }))}
            className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm"
            defaultLabel={
              <div className="flex items-center">
                <MapPin size={14} className="mr-2 text-gray-500" />
                City
              </div>
            }
          />
        </div>

        {/* Check-in Date */}
        <div className="flex flex-col flex-1">
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Check-out Date */}
        <div className="flex flex-col flex-1">
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm"
            min={checkInDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Guest Selection */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
            <button
              onClick={() => handleGuestChange(false)}
              className={`w-6 h-6 rounded-full bg-gray-100 border-none flex items-center justify-center ${
                guests <= 1 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:bg-gray-200'
              }`}
              disabled={guests <= 1}
            >
              <Minus size={12} />
            </button>
            <span className="text-sm font-medium">
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
            <button
              onClick={() => handleGuestChange(true)}
              className={`w-6 h-6 rounded-full bg-gray-100 border-none flex items-center justify-center ${
                guests >= 10 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:bg-gray-200'
              }`}
              disabled={guests >= 10}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-md border-none cursor-pointer whitespace-nowrap text-sm transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
