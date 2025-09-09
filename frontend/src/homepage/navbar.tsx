import React, { useState, useEffect } from 'react';
import { Building2, Info, BookOpen, Mail } from 'lucide-react';
import Dropdown from '../components/dropdown';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('GB');
  const [selectedCurrency, setSelectedCurrency] = useState('£ GBP');
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
      className={`navbar navbar-expand-lg navbar-light shadow-sm fixed-top py-3 ${scrolled ? 'bg-darkgreen' : 'bg-white'}`}
      style={{
        backgroundColor: scrolled ? '#0f5132' : 'white',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div className="container-fluid">
        {/* Logo */}
        <a
          className="navbar-brand fs-4 font-serif d-flex align-items-baseline"
          href="/"
          style={{
            color: scrolled ? 'white' : '#0f5132',
            fontWeight: '50',
            letterSpacing: '0.5px',
            transition: 'color 0.3s ease',
          }}
        >
          <img
            src={
              scrolled
                ? `${API_BASE_URL}/logos/favicon-white.png`
                : `${API_BASE_URL}/logos/favicon-dark-green.png`
            }
            alt="The Flex Logo"
            className="me-2"
            width="32"
            height="32"
          />
          the logo.
        </a>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Navigation Links */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link fw-medium d-flex align-items-center px-4 fs-6"
                href="/landlords"
                style={{
                  color: scrolled ? 'white' : 'black',
                  transition: 'color 0.3s ease',
                }}
              >
                <Building2 size={16} className="me-2" />
                Landlords
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-medium d-flex align-items-center px-4 fs-6"
                href="/about"
                style={{
                  color: scrolled ? 'white' : 'black',
                  transition: 'color 0.3s ease',
                }}
              >
                <Info size={16} className="me-2" />
                About us
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-medium d-flex align-items-center px-4 fs-6"
                href="/careers"
                style={{
                  color: scrolled ? 'white' : 'black',
                  transition: 'color 0.3s ease',
                }}
              >
                <BookOpen size={16} className="me-2" />
                Careers
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-medium d-flex align-items-center px-4 fs-6"
                href="/contact"
                style={{
                  color: scrolled ? 'white' : 'black',
                  transition: 'color 0.3s ease',
                }}
              >
                <Mail size={16} className="me-2" />
                Contact
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-1 ms-4">
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
    </nav>
  );
};

export default Navbar;
