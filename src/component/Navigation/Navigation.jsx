import { useState, useEffect, useRef } from 'react';
import styles from './Navigation.module.css';
import { Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isManualScrolling = useRef(false);
  const scrollEndTimeout = useRef(null);
  const observerRef = useRef(null);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  // Setup Intersection Observer for section detection
  useEffect(() => {
    // Clean up any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Get viewport height and calculate threshold
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    
    // Create options for the observer
    const options = {
      rootMargin: isMobile ? `-${viewportHeight * 0.1}px 0px -${viewportHeight * 0.6}px 0px` : 
                             `-100px 0px -${viewportHeight * 0.5}px 0px`,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
    };

    // Track sections that are currently in view
    const visibleSections = new Map();

    const handleIntersection = (entries) => {
      // Skip intersection updates during manual scrolling
      if (isManualScrolling.current) return;

      entries.forEach(entry => {
        // Update visibility status for this section
        visibleSections.set(entry.target.id, {
          id: entry.target.id,
          visible: entry.isIntersecting,
          ratio: entry.intersectionRatio,
          // Track top position for tie-breaking
          position: entry.boundingClientRect.top
        });
      });
      
      // Find the most visible section using a weighted approach
      // giving preference to sections near the top of the screen
      let bestSection = null;
      let bestScore = -1;
      
      visibleSections.forEach(section => {
        if (section.visible) {
          // Weight score by both visibility ratio and position from top
          // Lower position (closer to top) gets higher priority
          const positionScore = 1 - (Math.max(0, section.position) / viewportHeight);
          const visibilityScore = section.ratio;
          const score = visibilityScore * 0.7 + positionScore * 0.3;
          
          if (score > bestScore) {
            bestScore = score;
            bestSection = section.id;
          }
        }
      });
      
      // Special case for top of page
      if (window.scrollY < viewportHeight * 0.1) {
        bestSection = 'hero';
      }
      
      // Only update if we have a valid section
      if (bestSection && bestSection !== activeSection) {
        setActiveSection(bestSection);
      }
    };

    // Create and setup observer
    observerRef.current = new IntersectionObserver(handleIntersection, options);
    
    // Observe all sections
    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current.observe(element);
        // Initialize the visibility map
        visibleSections.set(id, { id, visible: false, ratio: 0, position: Infinity });
      }
    });

    // Clean up observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeSection, navItems]);

  // Improved scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Clear any existing timeout
    if (scrollEndTimeout.current) {
      clearTimeout(scrollEndTimeout.current);
    }
    
    // Mark that we're starting programmatic scrolling
    isManualScrolling.current = true;
    
    // Set active section immediately for better UX feedback
    setActiveSection(id);
    
    // Calculate offset based on viewport
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    const offset = isMobile ? viewportHeight * 0.08 : 80;
    
    // Get element position with offset
    const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
    
    // Scroll with smooth behavior
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
    
    // Allow time for the scroll to complete before re-enabling intersection observer
    // This is a more reliable approach than trying to detect when scrolling has ended
    const scrollDuration = Math.min(1000, Math.abs(window.scrollY - elementPosition) / 3);
    
    scrollEndTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, scrollDuration + 100); // Add a small buffer
  };

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