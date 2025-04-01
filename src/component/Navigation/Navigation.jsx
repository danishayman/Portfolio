import { useState, useEffect, useRef } from 'react';
import styles from './Navigation.module.css';
import { Menu, X, Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

// Modify the passive touch listeners setup
if (typeof window !== 'undefined') {
  try {
    let supportsPassive = false;
    const opts = Object.defineProperty({}, 'passive', {
      get: function() { supportsPassive = true; return true; }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
    
    if (supportsPassive) {
      // Add passive listeners for better scroll performance
      window.addEventListener('touchstart', function(){}, { passive: true });
      window.addEventListener('touchmove', function(){}, { passive: true });
      window.addEventListener('wheel', function(){}, { passive: true });
    }
  } catch (e) {
    // Do nothing if it fails
  }
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const [touchStartY, setTouchStartY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    setIsProgrammaticScrolling(true);
    setIsScrolling(true);
    
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    element.scrollIntoView({ behavior: 'smooth' });
    
    // Set a timeout to reset the scrolling state
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      setIsProgrammaticScrolling(false);
    }, 1000); // Adjust this value based on your scroll animation duration
  };

  const handleNavClick = (id) => {
    const now = Date.now();
    if (now - lastClickTime < 500) return; // Prevent rapid clicks
    setLastClickTime(now);
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (isScrolling) return; // Don't handle touch moves during programmatic scrolling
    
    const touchY = e.touches[0].clientY;
    const diff = touchY - touchStartY;
    
    // Only handle significant touch moves
    if (Math.abs(diff) > 10) {
      setIsScrolling(true);
    }
  };

  useEffect(() => {
    const observerCallback = (entries) => {
      if (isProgrammaticScrolling) return;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
      rootMargin: '-50% 0px -50% 0px'
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isProgrammaticScrolling]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        <div className={styles.container}>
          <div className={styles.menuItems}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation with enhanced touch handling */}
      <nav 
        className={styles.mobileNav}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className={styles.mobileContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.mobileNavItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
            >
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Navigation;