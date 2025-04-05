import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Navigation.module.css';
import { Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  // Improved throttle function with proper reference handling
  const throttle = useCallback((func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      func(...args);
    };
  }, []);

  // Calculate active section with more stable approach
  const calculateActiveSection = useCallback(() => {
    // Don't update during programmatic scrolling
    if (isScrollingRef.current) return;

    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    const offset = isMobile ? viewportHeight * 0.08 : 100; // Consistent with scroll offset
    
    // Find the section that is most visible in the viewport
    let maxVisibleSection = null;
    let maxVisiblePercentage = 0;
    let mostlyInView = false;
    
    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const sectionHeight = rect.height;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      
      // Calculate how much of the section is visible as a percentage
      if (visibleBottom > visibleTop) {
        const visibleHeight = visibleBottom - visibleTop;
        const visiblePercentage = (visibleHeight / sectionHeight) * 100;
        
        if (visiblePercentage > maxVisiblePercentage) {
          maxVisiblePercentage = visiblePercentage;
          maxVisibleSection = id;
          
          // If a section is mostly in view, prioritize it
          if (visiblePercentage > (isMobile ? 30 : 50)) {
            mostlyInView = true;
          }
        }
      }
    });
    
    // Special case for the top of the page (hero section)
    if (scrollPosition < offset) {
      maxVisibleSection = 'hero';
      mostlyInView = true;
    }
    
    // Only update if we have a section that is significantly in view
    if (maxVisibleSection && (mostlyInView || maxVisiblePercentage > (isMobile ? 15 : 25))) {
      setActiveSection(maxVisibleSection);
    }
  }, [navItems]);

  // Improved scroll to section function
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Clean up any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Mark that we're starting programmatic scrolling
    isScrollingRef.current = true;
    
    // Calculate dynamic offset based on viewport height for better mobile experience
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    const offset = isMobile ? viewportHeight * 0.08 : 80; // 8% of viewport height on mobile
    
    // Calculate position with a consistent offset
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    
    // Set active section right away for better UX
    setActiveSection(id);
    
    // Use requestAnimationFrame for smoother animation start
    requestAnimationFrame(() => {
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      // Create a detection system for when scrolling ends
      const checkScrollEnd = () => {
        const previousScrollTop = window.scrollY;
        
        // Check if scrolling has stopped after a short delay
        scrollTimeoutRef.current = setTimeout(() => {
          if (previousScrollTop === window.scrollY) {
            // Scrolling has stopped
            isScrollingRef.current = false;
            
            // Wait a bit longer before recalculating on mobile
            setTimeout(() => {
              if (!isScrollingRef.current) {
                calculateActiveSection();
              }
            }, isMobile ? 200 : 50);
          } else {
            // Still scrolling, check again
            checkScrollEnd();
          }
        }, isMobile ? 150 : 100);
      };
      
      checkScrollEnd();
    });
  }, [calculateActiveSection]);

  // Set up improved scroll event listener
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const throttleTime = isMobile ? 250 : 150; // Longer throttle time for mobile
    
    const handleScroll = throttle(() => {
      calculateActiveSection();
    }, throttleTime);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Calculate initial section after a short delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      calculateActiveSection();
    }, 100);
    
    // Handle window resize to adjust for mobile/desktop changes
    const handleResize = throttle(() => {
      // Recalculate section after resize
      isScrollingRef.current = false;
      calculateActiveSection();
    }, 200);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialTimeout);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [calculateActiveSection, throttle]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`${styles.desktopNav} ${isTransitioning ? styles.transitioning : ''}`}>
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
      <nav className={`${styles.mobileNav} ${isTransitioning ? styles.transitioning : ''}`}>
        <div className={styles.mobileContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.mobileNavItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => scrollToSection(item.id)}
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