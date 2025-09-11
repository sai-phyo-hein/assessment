import React, { useState, useEffect } from 'react';
import { Building2, Info, BookOpen, Mail } from 'lucide-react';
import Dropdown from '../components/dropdown';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('GB');
  const [selectedCurrency, setSelectedCurrency] = useState('£ GBP');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'GB', name: 'English', flag: '🇬🇧' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'DZ', name: 'العربية', flag: '🇩🇿' },
    { code: 'CN', name: 'Chinese', flag: '🇨🇳' },
  ];

  const currencies = ['$ USD', '€ EUR', '£ GBP'];

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

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 p-1"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? 'bg-white' : 'bg-gray-900'
              } ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            ></span>
            <span
              className={`block w-6 h-0.5 mt-1.5 transition-all duration-300 ${
                scrolled ? 'bg-white' : 'bg-gray-900'
              } ${mobileMenuOpen ? 'opacity-0' : ''}`}
            ></span>
            <span
              className={`block w-6 h-0.5 mt-1.5 transition-all duration-300 ${
                scrolled ? 'bg-white' : 'bg-gray-900'
              } ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            ></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex items-center space-x-0">
              <a
                href="/landlords"
                className={`flex items-center px-4 py-2 font-medium transition-colors duration-300 hover:scale-105 ${
                  scrolled
                    ? 'text-white hover:text-gray-200'
                    : 'text-black hover:text-flex-green'
                }`}
              >
                <Building2 size={16} className="mr-2" />
                Landlords
              </a>
              <a
                href="/about"
                className={`flex items-center px-4 py-2 font-medium transition-colors duration-300 hover:scale-105 ${
                  scrolled
                    ? 'text-white hover:text-gray-200'
                    : 'text-black hover:text-flex-green'
                }`}
              >
                <Info size={16} className="mr-2" />
                About us
              </a>
              <a
                href="/careers"
                className={`flex items-center px-4 py-2 font-medium transition-colors duration-300 hover:scale-105 ${
                  scrolled
                    ? 'text-white hover:text-gray-200'
                    : 'text-black hover:text-flex-green'
                }`}
              >
                <BookOpen size={16} className="mr-2" />
                Careers
              </a>
              <a
                href="/contact"
                className={`flex items-center px-4 py-2 font-medium transition-colors duration-300 hover:scale-105 ${
                  scrolled
                    ? 'text-white hover:text-gray-200'
                    : 'text-black hover:text-flex-green'
                }`}
              >
                <Mail size={16} className="mr-2" />
                Contact
              </a>
            </div>

            {/* Dropdowns */}
            <div className="flex items-center space-x-2">
              {/* Language Selection */}
              <Dropdown
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={languages.map((lang) => ({
                  value: lang.code,
                  label: `${lang.flag} ${lang.name}`,
                }))}
                scrolled={scrolled}
              />

              {/* Currency Selection */}
              <Dropdown
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                options={currencies.map((currency) => ({
                  value: currency,
                  label: currency,
                }))}
                scrolled={scrolled}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden absolute left-0 w-full transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'top-16 opacity-100'
              : 'top-14 opacity-0 pointer-events-none'
          } ${scrolled ? 'bg-flex-green' : 'bg-white'} border-t ${
            scrolled ? 'border-green-600' : 'border-gray-200'
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <a
              href="/landlords"
              className={`flex items-center px-4 py-3 font-medium transition-colors duration-300 rounded-lg ${
                scrolled
                  ? 'text-white hover:bg-green-600'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <Building2 size={16} className="mr-3" />
              Landlords
            </a>
            <a
              href="/about"
              className={`flex items-center px-4 py-3 font-medium transition-colors duration-300 rounded-lg ${
                scrolled
                  ? 'text-white hover:bg-green-600'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <Info size={16} className="mr-3" />
              About us
            </a>
            <a
              href="/careers"
              className={`flex items-center px-4 py-3 font-medium transition-colors duration-300 rounded-lg ${
                scrolled
                  ? 'text-white hover:bg-green-600'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <BookOpen size={16} className="mr-3" />
              Careers
            </a>
            <a
              href="/contact"
              className={`flex items-center px-4 py-3 font-medium transition-colors duration-300 rounded-lg ${
                scrolled
                  ? 'text-white hover:bg-green-600'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              <Mail size={16} className="mr-3" />
              Contact
            </a>

            {/* Mobile Dropdowns */}
            <div className="pt-4 border-t border-gray-300 space-y-3">
              <Dropdown
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={languages.map((lang) => ({
                  value: lang.code,
                  label: `${lang.flag} ${lang.name}`,
                }))}
                scrolled={scrolled}
              />
              <Dropdown
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                options={currencies.map((currency) => ({
                  value: currency,
                  label: currency,
                }))}
                scrolled={scrolled}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
