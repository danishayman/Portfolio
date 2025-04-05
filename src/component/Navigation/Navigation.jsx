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
    
    // Use a hysteresis approach - require more visibility to change sections
    // than to stay in the current section (prevents jumping back and forth)
    const currentSectionThreshold = isMobile ? 20 : 30;  // Lower threshold to keep current section
    const newSectionThreshold = isMobile ? 35 : 50;     // Higher threshold to change to new section
    
    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const sectionHeight = rect.height;
      
      // Get position relative to viewport
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      
      // Calculate how much of the section is visible as a percentage
      if (visibleBottom > visibleTop) {
        const visibleHeight = visibleBottom - visibleTop;
        const visiblePercentage = (visibleHeight / sectionHeight) * 100;
        
        // Special case: if section is very tall, consider how much of viewport it occupies too
        const viewportPercentage = (visibleHeight / viewportHeight) * 100;
        const effectivePercentage = Math.max(visiblePercentage, viewportPercentage);
        
        if (effectivePercentage > maxVisiblePercentage) {
          maxVisiblePercentage = effectivePercentage;
          maxVisibleSection = id;
          
          // If a section passes the threshold for new section, mark it
          if (effectivePercentage > newSectionThreshold) {
            mostlyInView = true;
          }
          // If current section is still reasonably visible, prefer it
          else if (id === activeSection && effectivePercentage > currentSectionThreshold) {
            mostlyInView = true;
          }
        } else if (id === activeSection && effectivePercentage > currentSectionThreshold) {
          // Special case: if current section is still reasonably visible but not the max,
          // keep it active to prevent jumping
          maxVisibleSection = id;
          maxVisiblePercentage = effectivePercentage;
          mostlyInView = true;
        }
      }
    });
    
    // Special case for the top of the page (hero section)
    if (scrollPosition < offset) {
      maxVisibleSection = 'hero';
      mostlyInView = true;
    }
    
    // Only update if we have a section that is significantly in view
    // or if the current section is no longer visible enough
    if (maxVisibleSection && 
        (mostlyInView || 
         (activeSection !== maxVisibleSection && maxVisiblePercentage > (isMobile ? 25 : 35)))) {
      setActiveSection(maxVisibleSection);
    }
  }, [navItems, activeSection]);

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
      
      // Extended settling time tracking
      let lastPositions = [];
      let isDecelerating = false;
      const positionSampleSize = 3;
      
      // Create a detection system for when scrolling ends with momentum detection
      const checkScrollEnd = () => {
        const currentScrollTop = window.scrollY;
        
        // Add current position to our samples
        lastPositions.push(currentScrollTop);
        if (lastPositions.length > positionSampleSize) {
          lastPositions.shift();
        }
        
        // Detect if we're decelerating (slowing down)
        if (lastPositions.length === positionSampleSize) {
          const movementDeltas = [];
          for (let i = 1; i < lastPositions.length; i++) {
            movementDeltas.push(Math.abs(lastPositions[i] - lastPositions[i-1]));
          }
          
          // If movement is getting smaller, we're decelerating
          isDecelerating = movementDeltas[0] > movementDeltas[movementDeltas.length-1];
        }
        
        // Check if we're completely stopped
        if (lastPositions.length >= 2 && 
            lastPositions[lastPositions.length-1] === lastPositions[lastPositions.length-2]) {
          
          // If we were decelerating and now we've stopped, add extra settling time
          const settlingDelay = isDecelerating ? (isMobile ? 400 : 200) : 0;
          
          setTimeout(() => {
            isScrollingRef.current = false;
            calculateActiveSection();
          }, settlingDelay);
          
          return;
        }
        
        // Still scrolling, check again
        scrollTimeoutRef.current = setTimeout(checkScrollEnd, isMobile ? 100 : 50);
      };
      
      // Start checking after initial delay
      scrollTimeoutRef.current = setTimeout(checkScrollEnd, 100);
    });
  }, [calculateActiveSection]);

  // Set up improved scroll event listener
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const throttleTime = isMobile ? 300 : 150; // Even longer throttle time for mobile
    let lastScrollTimestamp = 0;
    let scrollTimeout = null;
    
    const handleScroll = throttle(() => {
      const now = Date.now();
      
      // Reset any pending timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Don't recalculate during rapid scrolling or momentum scrolling
      // Instead, schedule a check for when scrolling has likely settled
      const timeSinceLastScroll = now - lastScrollTimestamp;
      lastScrollTimestamp = now;
      
      if (timeSinceLastScroll < 50) {
        // Rapid scrolling, delay any recalculation
        scrollTimeout = setTimeout(() => {
          if (!isScrollingRef.current) {
            calculateActiveSection();
          }
        }, isMobile ? 400 : 200);
        return;
      }
      
      // Normal scrolling or settled scrolling
      if (!isScrollingRef.current) {
        calculateActiveSection();
      }
    }, throttleTime);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Calculate initial section after a short delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      calculateActiveSection();
    }, 100);
    
    // Handle window resize to adjust for mobile/desktop changes
    const handleResize = throttle(() => {
      // Reset scrolling state
      isScrollingRef.current = false;
      // Clear any scheduled calculations
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      // Recalculate after a short delay to let the resize complete
      setTimeout(() => {
        calculateActiveSection();
      }, 100);
    }, 200);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialTimeout);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
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