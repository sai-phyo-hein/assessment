import React, { useState, useEffect } from 'react';
import SearchBar from './dashboard-search-bar';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav
      className={`fixed top-0 w-full z-50 h-20 shadow-sm transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-flex-green' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a
            href="/"
            className={`flex items-baseline text-xl font-serif font-light tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-white' : 'text-flex-green'
            }`}
          >
            <img
              src={
                scrolled
                  ? `${API_BASE_URL}/logos/favicon-white.png`
                  : `${API_BASE_URL}/logos/favicon-dark-green.png`
              }
              alt="The Flex Logo"
              className="w-8 h-8 mr-3"
            />
            the flex.
          </a>

          {/* Search Bar */}
          <div className="flex-1 mx-8">
            <SearchBar scrolled={scrolled} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;