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

    // Calculate horizontal position - stick to the left edge of the button
    let leftPosition = rect.left;
    
    // If dropdown would go off-screen to the right, align it to the right edge of button
    if (leftPosition + dropdownWidth > viewportWidth) {
      leftPosition = rect.right - dropdownWidth;
    }
    
    // Ensure dropdown doesn't go off-screen to the left
    if (leftPosition < 0) {
      leftPosition = 8; // Small margin from viewport edge
    }

    // Calculate vertical position - check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    // Position dropdown to stick directly to the button edge
    const topPosition = showAbove ? rect.top : rect.bottom;

    setDropdownPosition({
      top: topPosition,
      left: leftPosition,
      width: Math.max(dropdownWidth, rect.width), // Use button width if larger than dropdown
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
        className={`text-left bg-transparent border-none outline-none focus:outline-none cursor-pointer font-medium transition-colors duration-300 ${
          scrolled ? 'text-white' : 'text-flex-natural'
        } ${className || ''}`}
        style={style}
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
            className="fixed bg-white shadow-lg rounded-md border border-gray-200 p-1 overflow-hidden"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
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
                  className={`w-full text-left px-4 py-3 border-none outline-none cursor-pointer whitespace-nowrap transition-colors text-base font-medium min-h-[48px] ${
                    isFirst ? 'rounded-t-md' : ''
                  } ${isLast ? 'rounded-b-md' : ''} ${
                    option.value === value 
                      ? 'bg-flex-green text-white' 
                      : 'bg-white text-gray-800 hover:bg-flex-green/10'
                  }`}
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