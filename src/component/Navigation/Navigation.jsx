import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { Menu, X, Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

// Add passive touch listeners for better performance
if (typeof window !== 'undefined') {
  try {
    // Test via a getter in the options object to see if passive is supported
    let supportsPassive = false;
    const opts = Object.defineProperty({}, 'passive', {
      get: function() { supportsPassive = true; return true; }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
    
    // If passive is supported, add passive: true to all touch listeners
    if (supportsPassive) {
      const wheelOpt = { passive: true };
      const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
      
      window.addEventListener('touchstart', function(){}, wheelOpt);
      window.addEventListener('touchmove', function(){}, wheelOpt);
      window.addEventListener(wheelEvent, function(){}, wheelOpt);
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

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Use percentage instead of fixed pixels
      threshold: [0.1, 0.5] // Multiple thresholds for better accuracy
    };

    const observerCallback = (entries) => {
      if (isProgrammaticScrolling) return;
      
      // Find the most visible section
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by visibility ratio and pick the most visible
        const mostVisible = visibleEntries.reduce((prev, current) => 
          (prev.intersectionRatio > current.intersectionRatio) ? prev : current
        );
        setActiveSection(mostVisible.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    navItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      navItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [navItems, isProgrammaticScrolling]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setIsProgrammaticScrolling(true);
      
      const offset = 80; // This should match your navbar height
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      setActiveSection(id);
      setIsMenuOpen(false);
      
      setTimeout(() => {
        setIsProgrammaticScrolling(false);
      }, 1000); // Adjust based on your scroll animation duration
    }
  };

  const handleNavClick = (id) => {
    const now = Date.now();
    // Prevent multiple clicks within 500ms
    if (now - lastClickTime < 500) return;
    
    setLastClickTime(now);
    scrollToSection(id);
  };

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

      {/* Mobile Navigation */}
      <nav className={styles.mobileNav}>
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