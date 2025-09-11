import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Plus,
  Minus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User2,
} from 'lucide-react';
import Dropdown from '../components/dropdown';

interface SearchBarProps {
  style?: React.CSSProperties;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ style, className = '' }) => {
  const [selectedCity, setSelectedCity] = useState('City');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonthLeft, setCurrentMonthLeft] = useState(new Date());
  const [currentMonthRight, setCurrentMonthRight] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const [isDatePickerAbove, setIsDatePickerAbove] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({
    top: 0,
    left: 0,
  });
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);

  const cities = ['London', 'Paris', 'Algiers', 'Lisbon'];

  const handleGuestChange = (increment: boolean) => {
    if (increment) {
      setGuests((prev) => Math.min(prev + 1, 10)); // Max 10 guests
    } else {
      setGuests((prev) => Math.max(prev - 1, 1)); // Min 1 guest
    }
  };

  const formatDateDisplay = () => {
    if (checkInDate && checkOutDate) {
      const checkIn = checkInDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const checkOut = checkOutDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${checkIn} - ${checkOut}`;
    } else if (checkInDate) {
      return `${checkInDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - Select end`;
    }
    return 'Dates';
  };

  const navigateMonth = (
    direction: 'prev' | 'next',
    calendar: 'left' | 'right'
  ) => {
    if (calendar === 'left') {
      setCurrentMonthLeft((prev) => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
        return newMonth;
      });
    } else {
      setCurrentMonthRight((prev) => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
        return newMonth;
      });
    }
  };

  const handleDateSelect = (date: Date) => {
    if (selectingCheckIn) {
      setCheckInDate(date);
      setSelectingCheckIn(false);
    } else {
      if (checkInDate && date < checkInDate) {
        setCheckOutDate(checkInDate);
        setCheckInDate(date);
      } else {
        setCheckOutDate(date);
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
      const isSelected =
        (selectingCheckIn &&
          checkInDate &&
          current.toDateString() === checkInDate.toDateString()) ||
        (!selectingCheckIn &&
          checkOutDate &&
          current.toDateString() === checkOutDate.toDateString());
      const isInRange =
        checkInDate &&
        checkOutDate &&
        current >= checkInDate &&
        current <= checkOutDate;
      days.push(
        <button
          key={current.toISOString()}
          onClick={() => handleDateSelect(new Date(current))}
          className={`w-10 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
            !isCurrentMonth
              ? 'text-gray-300'
              : isSelected
                ? 'bg-emerald-600 text-white'
                : isInRange
                  ? 'bg-emerald-100'
                  : 'hover:bg-gray-100'
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
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    const checkPosition = () => {
      if (dateButtonRef.current && showDatePicker) {
        const rect = dateButtonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const datePickerHeight = 400; // Approximate height of date picker
        const spaceBelow = windowHeight - rect.bottom;
        const isAbove =
          spaceBelow < datePickerHeight && rect.top > datePickerHeight;
        setIsDatePickerAbove(isAbove);
        setDatePickerPosition({
          top: isAbove ? rect.top - datePickerHeight : rect.bottom,
          left: rect.left,
        });
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
                year: 'numeric',
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
              <div
                key={day}
                className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500"
              >
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
                year: 'numeric',
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
              <div
                key={day}
                className="w-10 h-8 flex items-center justify-center text-xs font-medium text-gray-500"
              >
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
              setCurrentMonthLeft((prev) => {
                const newMonth = new Date(prev);
                newMonth.setMonth(prev.getMonth() - 1);
                return newMonth;
              });
              setCurrentMonthRight((prev) => {
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
              setCurrentMonthLeft((prev) => {
                const newMonth = new Date(prev);
                newMonth.setMonth(prev.getMonth() + 1);
                return newMonth;
              });
              setCurrentMonthRight((prev) => {
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
            {selectingCheckIn
              ? 'Select check-in date'
              : 'Select check-out date'}
          </span>
          {checkInDate && checkOutDate && (
            <button
              onClick={() => {
                setCheckInDate(null);
                setCheckOutDate(null);
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
      className={`bg-vanilla rounded-lg shadow-xl p-4 max-w-6xl mx-auto relative z-20 h-30 ${className}`}
      style={style}
    >
      <div className="flex items-center gap-4">
        <div className="flex-none w-64">
          <Dropdown
            value={selectedCity}
            onChange={setSelectedCity}
            options={cities.map((city) => ({
              value: city,
              label: (
                <div className="flex items-center">
                  <MapPin size={30} className="mr-2 text-gray-500" />
                  {city}
                </div>
              ),
            }))}
            className="w-full p-3 border border-gray-300 rounded-md outline-none text-large"
            defaultLabel={
              <div className="flex items-center">
                <MapPin size={30} className="mr-2 text-gray-500" />
                City
              </div>
            }
          />
        </div>

        <div className="flex-none w-64 relative">
          <button
            ref={dateButtonRef}
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full p-3 rounded-md outline-none text-large text-left flex items-center bg-vanilla transition-colors"
          >
            <Calendar size={30} className="mr-2 text-gray-500" />
            {formatDateDisplay()}
          </button>

          {showDatePicker && createPortal(<DatePickerContent />, document.body)}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between p-3 rounded-md bg-vanilla">
            <button
              onClick={() => handleGuestChange(false)}
              className="hover:border-transparent"
              disabled={guests <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <User2 size={30} /> {guests} {guests === 1 ? 'Guest' : 'Guests'}
            </span>
            <button
              onClick={() => handleGuestChange(true)}
              className="hover:border-transparent"
              disabled={guests >= 10}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-md border-none cursor-pointer whitespace-nowrap text-sm transition-colors h-12">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
