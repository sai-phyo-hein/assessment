import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DropdownOption {
  value: string;
  label: string | React.ReactNode;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  className?: string;
  style?: React.CSSProperties;
  scrolled?: boolean;
  defaultLabel?: string | React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  className = '',
  style,
  scrolled = false,
  defaultLabel = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    showAbove: false,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update dropdown position on scroll or resize
  const updateDropdownPosition = () => {
    if (!triggerRef.current || !isOpen) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 180;
    const dropdownHeight = options.length * 48 + 8; // Approximate height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate horizontal position
    let leftPosition = rect.left;
    if (leftPosition + dropdownWidth > viewportWidth) {
      leftPosition = rect.right - dropdownWidth;
    }

    // Calculate vertical position - check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    const topPosition = showAbove ? rect.top - dropdownHeight : rect.bottom;

    setDropdownPosition({
      top: topPosition,
      left: leftPosition,
      width: rect.width,
      showAbove,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Handle scroll and resize events to keep dropdown positioned correctly
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updateDropdownPosition();
    };

    // Add event listeners for scroll on window and all parent elements
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    // Initial position update after dropdown is rendered - with slight delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      updateDropdownPosition();
    }, 10);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      clearTimeout(timeoutId);
    };
  }, [isOpen, options.length]);

  const selectedOption = options.find((option) => option.value === value);

  const handleToggle = () => {
    if (!isOpen) {
      // Calculate position when opening
      setTimeout(() => updateDropdownPosition(), 0);
    }
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`text-left bg-transparent border-none outline-none focus:outline-none cursor-pointer fw-medium ${scrolled ? 'text-white' : 'text-dark'} ${className}`}
        style={{
          ...style,
          color: scrolled ? 'white !important' : '#0f5132',
          transition: 'color 0.3s ease',
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedOption?.label || defaultLabel}
      </button>

      {/* Dropdown Options - Rendered outside DOM via Portal */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            className={`fixed bg-white shadow-lg rounded-md border border-gray-200 p-1 ${
              dropdownPosition.showAbove ? 'rounded-2-above' : 'rounded-2'
            }`}
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: '180px',
              zIndex: 99999,
              display: 'flex',
              flexDirection: dropdownPosition.showAbove
                ? 'column-reverse'
                : 'column',
              overflowY: 'hidden',
              pointerEvents: 'auto',
              transform: dropdownPosition.showAbove
                ? 'translateY(-100%) translateZ(0)' // Move dropdown above by its full height
                : 'translateZ(0)', // Keep below
              maxHeight: '300px',
              boxShadow: dropdownPosition.showAbove
                ? '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            {options.map((option, index) => {
              const isFirst = dropdownPosition.showAbove
                ? index === options.length - 1
                : index === 0;
              const isLast = dropdownPosition.showAbove
                ? index === 0
                : index === options.length - 1;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`w-full text-left px-4 py-3 border-none outline-none cursor-pointer whitespace-nowrap transition-colors text-base fw-medium ${
                    isFirst ? 'rounded-t-md' : ''
                  } ${isLast ? 'rounded-b-md' : ''}`}
                  style={{
                    display: 'block',
                    boxSizing: 'border-box',
                    margin: 0,
                    padding: '12px 16px',
                    fontSize: '16px',
                    minHeight: '48px',
                    backgroundColor:
                      option.value === value ? '#0f5132' : 'white',
                    color: option.value === value ? 'white' : '#333',
                  }}
                  onMouseEnter={(e) => {
                    if (option.value !== value) {
                      e.currentTarget.style.backgroundColor =
                        'rgba(15, 81, 50, 0.1)';
                      e.currentTarget.style.border = 'none';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (option.value !== value) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.border = 'none';
                    }
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
};

export default Dropdown;
