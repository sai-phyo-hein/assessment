import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Dropdown from '../components/dropdown';

interface SearchBarProps {
  style?: React.CSSProperties;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ style, className = '' }) => {
  const [selectedCity, setSelectedCity] = useState('City');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonthLeft, setCurrentMonthLeft] = useState(new Date());
  const [currentMonthRight, setCurrentMonthRight] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);

  const cities = ['London', 'Paris', 'Algiers', 'Lisbon']

  const formatDateDisplay = () => {
    if (startDate && endDate) {
      const checkIn = startDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const checkOut = endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      return `${checkIn} - ${checkOut}`;
    } else if (startDate) {
      return `${startDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - Select end date`;
    }
    return 'Dates';
  };

  const navigateMonth = (direction: 'prev' | 'next', calendar: 'left' | 'right') => {
    if (calendar === 'left') {
      setCurrentMonthLeft(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
        return newMonth;
      });
    } else {
      setCurrentMonthRight(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
        return newMonth;
      });
    }
  };

  const handleDateSelect = (date: Date) => {
    if (selectingCheckIn) {
      setStartDate(date);
      setSelectingCheckIn(false);
    } else {
      if (startDate && date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelectingCheckIn(true);
      setShowDatePicker(false);
    }
  };

  const renderCalendar = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    const days = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      const isCurrentMonth = current.getMonth() === month.getMonth();
      const isSelected = (selectingCheckIn && startDate && current.toDateString() === startDate.toDateString()) ||
                        (!selectingCheckIn && endDate && current.toDateString() === endDate.toDateString());
      const isInRange = startDate && endDate && current >= startDate && current <= endDate;
      days.push(
        <button
          key={current.toISOString()}
          onClick={() => handleDateSelect(new Date(current))}
          className={`w-10 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
            !isCurrentMonth ? 'text-gray-300' :
            isSelected ? 'bg-emerald-600 text-white' :
            isInRange ? 'bg-emerald-100' :
            'hover:bg-gray-100'
          }`}
          disabled={!isCurrentMonth}
        >
          {current.getDate()}
        </button>
      );
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    const checkPosition = () => {
      if (dateButtonRef.current && showDatePicker) {
        const rect = dateButtonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const datePickerHeight = 400;
        const datePickerWidth = 768;
        const spaceBelow = windowHeight - rect.bottom;
        const spaceAbove = rect.top;
        const isAbove = spaceBelow < datePickerHeight && spaceAbove > datePickerHeight;
        let top = isAbove ? rect.top - datePickerHeight : rect.bottom;
        if (top < 0) top = 0;
        if (top + datePickerHeight > windowHeight) top = windowHeight - datePickerHeight;
        let left = rect.left;
        if (left + datePickerWidth > windowWidth) left = windowWidth - datePickerWidth;
        if (left < 0) left = 0;
        setDatePickerPosition({ top, left });
      }
    };

    if (showDatePicker) {
      checkPosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', checkPosition);
      window.addEventListener('scroll', checkPosition, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkPosition);
      window.removeEventListener('scroll', checkPosition, true);
    };
  }, [showDatePicker]);

  const DatePickerContent = () => (
    <div
      ref={datePickerRef}
      className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl p-4 w-[768px] z-[10000]"
      style={{
        top: `${datePickerPosition.top}px`,
        left: `${datePickerPosition.left}px`,
        isolation: 'isolate',
      }}
    >
      <div className="flex gap-4">
        <div className="w-1/2">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev', 'left')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-medium text-gray-900">
              {currentMonthLeft.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => navigateMonth('next', 'left')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar(currentMonthLeft)}
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev', 'right')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="font-medium text-gray-900">
              {currentMonthRight.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => navigateMonth('next', 'right')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar(currentMonthRight)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentMonthLeft(prev => {
                const newMonth = new Date(prev);
                newMonth.setMonth(prev.getMonth() - 1);
                return newMonth;
              });
              setCurrentMonthRight(prev => {
                const newMonth = new Date(prev);
                newMonth.setMonth(prev.getMonth() - 1);
                return newMonth;
              });
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => {
              setCurrentMonthLeft(prev => {
                const newMonth = new Date(prev);
                newMonth.setMonth(prev.getMonth() + 1);
                return newMonth;
              });
              setCurrentMonthRight(prev => {
                const newMonth = new Date(prev);
                newMonth.setMonth(prev.getMonth() + 1);
                return newMonth;
              });
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {selectingCheckIn ? 'Select start date' : 'Select end date'}
          </span>
          {startDate && endDate && (
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setSelectingCheckIn(true);
              }}
              className="text-emerald-600 hover:text-emerald-700"
            >
              Clear dates
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-transparent px-4 max-w-6xl relative z-20 ${className}`}
      style={style}
    >
      <div className="flex items-center justify-center gap-4">
        <div className="flex-none w-40">
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

        <div className="flex-none w-40 relative">
          <button
            ref={dateButtonRef}
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full p-3 rounded-md outline-none text-sm text-left flex items-center bg-transparent transition-colors"
          >
            <Calendar size={14} className="mr-2 text-gray-500" />
            {formatDateDisplay()}
          </button>
          
          {showDatePicker && createPortal(<DatePickerContent />, document.body)}
        </div>

      </div>
    </div>
  );
};

export default SearchBar;