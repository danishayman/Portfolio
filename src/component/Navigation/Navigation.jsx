import { useState, useEffect } from 'react';
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
      // Only add passive listeners - don't try to prevent default behavior globally
      window.addEventListener('touchstart', function(){}, { passive: true });
      window.addEventListener('touchmove', function(){}, { passive: true });
      
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
    // Modify the intersection observer configuration for better accuracy
    const observerOptions = {
      root: null,
      // Use a smaller rootMargin to make it less aggressive
      rootMargin: '-5% 0px -5% 0px', 
      // Use lower thresholds for smoother transitions
      threshold: [0.1, 0.3] 
    };

    const observerCallback = (entries) => {
      // Only process intersection events if not in programmatic scrolling
      if (isProgrammaticScrolling) return;
      
      // Find the most visible section
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by visibility ratio and pick the most visible
        const mostVisible = visibleEntries.reduce((prev, current) => 
          (prev.intersectionRatio > current.intersectionRatio) ? prev : current
        );
        
        // Only update if it's substantially different to avoid flicker
        if (mostVisible.intersectionRatio > 0.2) {
          setActiveSection(mostVisible.target.id);
        }
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

  // Completely revise the scrollToSection implementation
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Set programmatic scrolling state
    setIsProgrammaticScrolling(true);
    
    // Calculate position
    const offset = 80; // Navbar height
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    // Set active section immediately to avoid visual lag
    setActiveSection(id);
    setIsMenuOpen(false);
    
    // Scroll to the section
    try {
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for browsers that don't support smooth scrolling
      window.scrollTo(0, elementPosition);
    }
    
    // Use a combination of techniques to detect when scrolling has stopped
    
    // 1. Set a maximum duration for programmatic scrolling
    const maxScrollDuration = 2000; // 2 seconds max
    const scrollTimeout = setTimeout(() => {
      setIsProgrammaticScrolling(false);
    }, maxScrollDuration);
    
    // 2. Use scroll events to detect natural stop
    let previousScrollPosition = window.pageYOffset;
    let scrollStoppedTimer = null;
    let scrollingHasStopped = false;
    
    const checkIfScrollHasStopped = () => {
      const currentScrollPosition = window.pageYOffset;
      
      // If position hasn't changed, scrolling has likely stopped
      if (currentScrollPosition === previousScrollPosition && !scrollingHasStopped) {
        scrollingHasStopped = true;
        setIsProgrammaticScrolling(false);
        window.removeEventListener('scroll', scrollListener);
        clearTimeout(scrollTimeout);
      } else {
        previousScrollPosition = currentScrollPosition;
        // Continue checking until max duration
        scrollStoppedTimer = setTimeout(checkIfScrollHasStopped, 100);
      }
    };
    
    const scrollListener = () => {
      // Clear previous timer
      if (scrollStoppedTimer) {
        clearTimeout(scrollStoppedTimer);
      }
      // Set new timer
      scrollStoppedTimer = setTimeout(checkIfScrollHasStopped, 100);
    };
    
    window.addEventListener('scroll', scrollListener);
    
    // Initial timer to start checking if scrolling has stopped
    scrollStoppedTimer = setTimeout(checkIfScrollHasStopped, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(scrollStoppedTimer);
      window.removeEventListener('scroll', scrollListener);
    };
  };

  // Enhanced click handler with touch detection
  const handleNavClick = (id) => {
    const now = Date.now();
    // Prevent multiple clicks within 700ms (increased from 500ms)
    if (now - lastClickTime < 700) return;
    
    setLastClickTime(now);
    scrollToSection(id);
  };
  
  // Improved touch handlers in the Navigation component
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e) => {
    // Don't prevent default scrolling - this may be causing the lock effect
    // We'll only track the movement but not interfere with the browser's handling
    const touchDiff = Math.abs(e.touches[0].clientY - touchStartY);
    
    // If there's significant movement, update the touch position
    if (touchDiff > 5) {
      setTouchStartY(e.touches[0].clientY);
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