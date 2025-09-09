import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Minus } from 'lucide-react';
import Dropdown from './dropdown';

interface SearchBarProps {
  style?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({ style }) => {
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
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: '0px',
        position: 'relative',
        zIndex: 20,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
        {/* City Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Dropdown
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities.map((city) => ({
              value: city,
              label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MapPin
                    size={14}
                    style={{ marginRight: '8px', color: '#6b7280' }}
                  />
                  {city}
                </div>
              ),
            }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '14px',
            }}
            defaultLabel={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MapPin
                  size={14}
                  style={{ marginRight: '8px', color: '#6b7280' }}
                />
                City
              </div>
            }
          />
        </div>

        {/* Check-in Date */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '14px',
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Check-out Date */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              fontSize: '14px',
            }}
            min={checkInDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Guest Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
            }}
          >
            <button
              onClick={() => handleGuestChange(false)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: guests <= 1 ? 'not-allowed' : 'pointer',
                opacity: guests <= 1 ? 0.5 : 1,
              }}
              disabled={guests <= 1}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
            <button
              onClick={() => handleGuestChange(true)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: guests >= 10 ? 'not-allowed' : 'pointer',
                opacity: guests >= 10 ? 0.5 : 1,
              }}
              disabled={guests >= 10}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            style={{
              backgroundColor: '#059669',
              color: 'white',
              fontWeight: '500',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '14px',
            }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
