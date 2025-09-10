import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from '../components/dropdown';
import { useAppStore } from '../global-store';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface SearchBarProps {
  style?: React.CSSProperties;
  className?: string;
  scrolled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ style, className = '', scrolled = false }) => {
  const [selectedCity, setSelectedCity] = useState('City');
  const [isCalendarsOpen, setIsCalendarsOpen] = useState(false);
  const { startDate, endDate, setDashboardDateRange, minDate, maxDate, setDateRangeConstraints, isSummaryView, setIsSummaryView } = useAppStore();
  const startDatePickerRef = useRef<any>(null);
  const endDatePickerRef = useRef<any>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const cities = ['London', 'Paris', 'Algiers', 'Lisbon'];

  useEffect(() => {
    const fetchDateRange = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/reviews-date-range`);
        if (response.ok) {
          const data = await response.json();
          if (data.minDate && data.maxDate) {
            const minDateObj = new Date(data.minDate);
            const maxDateObj = new Date(data.maxDate);
            setDateRangeConstraints?.(minDateObj, maxDateObj);
          }
        }
      } catch (error) {
        console.error('Failed to fetch date range:', error);
      }
    };

    fetchDateRange();
  }, [setDateRangeConstraints]);

  const formatDateDisplay = (date: Date | null | undefined, placeholder: string) => {
    if (date) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return placeholder;
  };

  const handleStartDateChange = (date: Date | null) => {
    setDashboardDateRange?.(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    setDashboardDateRange?.(startDate, date);
  };

  const toggleCalendars = () => {
    setIsCalendarsOpen((prev) => !prev);
  };

  // Adjust calendar position to stay within viewport
  useEffect(() => {
    if (isCalendarsOpen && calendarContainerRef.current && toggleButtonRef.current) {
      const adjustPosition = () => {
        const container = calendarContainerRef.current;
        const button = toggleButtonRef.current;
        if (!container || !button) return;

        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Reset any previous positioning
        container.style.top = '';
        container.style.left = '';
        container.style.transform = '';

        // Check vertical space
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const containerHeight = containerRect.height;

        // Check horizontal space
        const spaceRight = viewportWidth - buttonRect.left;
        const containerWidth = containerRect.width;

        // Vertical positioning: prefer below, but flip above if not enough space
        if (spaceBelow < containerHeight && spaceAbove > containerHeight) {
          // Position above the button
          container.style.top = 'auto';
          container.style.bottom = `${buttonRect.height + 8}px`; // 8px margin
        } else {
          // Position below the button (default)
          container.style.top = `${buttonRect.height + 8}px`; // 8px margin
          container.style.bottom = 'auto';
        }

        // Horizontal positioning: adjust if overflowing right edge
        if (spaceRight < containerWidth) {
          // Shift left to keep within viewport
          const offset = containerWidth - spaceRight;
          container.style.left = `-${offset}px`;
        } else {
          container.style.left = '0';
        }
      };

      adjustPosition();
      // Re-run adjustment on window resize
      window.addEventListener('resize', adjustPosition);
      return () => window.removeEventListener('resize', adjustPosition);
    }
  }, [isCalendarsOpen]);

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const calendarContainer = calendarContainerRef.current;
      const toggleButton = toggleButtonRef.current;

      if (
        calendarContainer &&
        !calendarContainer.contains(target) &&
        toggleButton &&
        !toggleButton.contains(target)
      ) {
        setIsCalendarsOpen(false);
      }
    };

    if (isCalendarsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCalendarsOpen]);

  return (
    <div
      className={`bg-transparent px-4 max-w-6xl relative z-20 ${className}`}
      style={style}
    >
      <div className="flex items-center justify-end gap-6">
        {/* City Dropdown */}
        <div className="flex-none w-40">
          <Dropdown
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities.map((city) => ({
              value: city,
              label: (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {city}
                </div>
              ),
            }))}
            className="w-full p-3 border border-gray-300 rounded-md outline-none text-sm"
            scrolled={scrolled}
            defaultLabel={
              <div className="flex items-center">
                <MapPin size={14} className={`mr-2 ${scrolled ? 'text-white' : 'text-gray-500'}`} />
                City
              </div>
            }
          />
        </div>

        {/* Date Selection */}
        <div className="flex-none relative">
          <button
            ref={toggleButtonRef}
            className="calendar-toggle-button flex items-center gap-4 p-3 rounded-md outline-none text-sm bg-transparent transition-colors"
            onClick={toggleCalendars}
          >
            {/* Start Date */}
            <div className="flex items-center">
              <Calendar size={14} className={`mr-2 ${scrolled ? 'text-white' : 'text-gray-500'}`} />
              <span className={scrolled ? 'text-white' : 'text-gray-700'}>
                {formatDateDisplay(startDate, 'Start date')}
              </span>
            </div>

            {/* Separator */}
            <div className={scrolled ? 'text-white' : 'text-gray-400'}>to</div>

            {/* End Date */}
            <div className="flex items-center">
              <Calendar size={14} className={`mr-2 ${scrolled ? 'text-white' : 'text-gray-500'}`} />
              <span className={scrolled ? 'text-white' : 'text-gray-700'}>
                {formatDateDisplay(endDate, 'End date')}
              </span>
            </div>

            {/* Toggle Icon */}
            {isCalendarsOpen ? (
              <ChevronUp size={16} className={scrolled ? 'text-white' : 'text-gray-500'} />
            ) : (
              <ChevronDown size={16} className={scrolled ? 'text-white' : 'text-gray-500'} />
            )}
          </button>

          {/* Calendars Container */}
          {isCalendarsOpen && (
            <div
              ref={calendarContainerRef}
              className="calendars-container absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50"
            >
              <div className="flex gap-6">
                {/* Start Date Calendar */}
                <div className="flex flex-col items-center">
                  <h3 className={`text-sm font-medium mb-2 ${scrolled ? 'text-gray-900' : 'text-gray-700'}`}>
                    Start Date
                  </h3>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    minDate={minDate || undefined}
                    maxDate={endDate || maxDate || undefined}
                    placeholderText="Select start date"
                    inline
                    ref={startDatePickerRef}
                  />
                </div>

                {/* End Date Calendar */}
                <div className="flex flex-col items-center">
                  <h3 className={`text-sm font-medium mb-2 ${scrolled ? 'text-gray-900' : 'text-gray-700'}`}>
                    End Date
                  </h3>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate || minDate || undefined}
                    maxDate={maxDate || undefined}
                    placeholderText="Select end date"
                    inline
                    ref={endDatePickerRef}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    scrolled ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setDashboardDateRange?.(null, null);
                  }}
                >
                  Clear
                </button>
                <button
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
                  onClick={() => setIsCalendarsOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="flex-none">
          <button
            className={`flex items-center justify-center text-center ml-6 gap-2 p-3 w-32 rounded-md outline-none text-sm bg-transparent transition-colors ${
              scrolled ? 'text-white border-vanilla' : 'text-gray-700 border-flex-green'
            }`}
            onClick={() => setIsSummaryView(!isSummaryView)}
          >
            <span>{isSummaryView ? 'Details' : 'Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;