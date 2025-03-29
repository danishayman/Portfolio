import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { Menu, X, Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

// Modify the passive touch listeners setup
if (typeof window !== 'undefined') {
  try {
    // Test via a getter in the options object to see if passive is supported
    let supportsPassive = false;
    const opts = Object.defineProperty({}, 'passive', {
      get: function() { supportsPassive = true; return true; }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
    
    // Use passive: false for touchmove to allow preventDefault when needed
    if (supportsPassive) {
      window.addEventListener('touchstart', function(){}, { passive: true });
      // Use passive: false for touchmove to be able to prevent default behavior if needed
      window.addEventListener('touchmove', function(e){
        // Prevent touchmove events from causing unwanted scrolling only on specific elements
        if (e.target.closest('.mobileNav')) {
          // Only prevent default if it's a short touch move (likely accidental)
          const touchThreshold = 5; // pixels
          if (Math.abs(e.touches[0].clientY - e.touches[0].initialClientY) < touchThreshold) {
            e.preventDefault();
          }
        }
      }, { passive: false });
      
      const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
      window.addEventListener(wheelEvent, function(){}, { passive: true });
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

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  useEffect(() => {
    // Add a more reliable intersection observer with higher threshold and better tolerance
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -15% 0px', // Increased margins
      threshold: [0.2, 0.5, 0.8] // More threshold points for better accuracy
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

  // Add to the useEffect that depends on isProgrammaticScrolling
  useEffect(() => {
    // Lock/unlock body scroll based on programmatic scrolling state
    if (isProgrammaticScrolling) {
      // Only add the class - don't prevent scrolling entirely
      document.body.classList.add('is-programmatic-scrolling');
    } else {
      document.body.classList.remove('is-programmatic-scrolling');
    }
    
    return () => {
      // Clean up
      document.body.classList.remove('is-programmatic-scrolling');
    };
  }, [isProgrammaticScrolling]);

  // Enhance scrollToSection with better timing 
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
      
      // Use a longer timeout and add a cleanup in case user interacts during scroll
      const timer = setTimeout(() => {
        setIsProgrammaticScrolling(false);
      }, 1500); // 1.5 seconds for slower devices
      
      // Add a scroll event listener to detect when scrolling stops
      const handleScrollEnd = debounce(() => {
        setIsProgrammaticScrolling(false);
        window.removeEventListener('scroll', handleScrollEnd);
      }, 100);
      
      window.addEventListener('scroll', handleScrollEnd);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScrollEnd);
      };
    }
  };

  // Enhanced click handler with touch detection
  const handleNavClick = (id) => {
    const now = Date.now();
    // Prevent multiple clicks within 700ms (increased from 500ms)
    if (now - lastClickTime < 700) return;
    
    setLastClickTime(now);
    scrollToSection(id);
  };
  
  // Add touch handlers to prevent accidental scrolling from the navigation bar
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e) => {
    // If touch movement is very small, prevent default to avoid accidental scrolling
    const touchDiff = Math.abs(e.touches[0].clientY - touchStartY);
    if (touchDiff < 10) {
      e.preventDefault();
    }
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