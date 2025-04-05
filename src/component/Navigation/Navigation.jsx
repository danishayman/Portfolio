import { useState, useEffect, useCallback } from 'react';
import styles from './Navigation.module.css';
import { Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const { theme, toggleTheme, isTransitioning } = useTheme();

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  // Throttle function to limit how often a function can run
  const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  };

  // Simple threshold-based approach to determine active section
  const calculateActiveSection = useCallback(() => {
    // Don't update active section during programmatic scrolling
    if (window.isScrollingProgrammatically) return;

    const scrollPosition = window.scrollY;
    const offset = 100; // Offset for navbar height + some padding
    
    // Find the section that has passed its top boundary but not its bottom boundary
    // Go through sections in reverse to prioritize later sections when at boundaries
    for (let i = navItems.length - 1; i >= 0; i--) {
      const { id } = navItems[i];
      const element = document.getElementById(id);
      if (!element) continue;
      
      const sectionTop = element.offsetTop - offset;
      
      // For the first section, make it active when at the top of the page
      if (i === 0 && scrollPosition < sectionTop) {
        setActiveSection(id);
        return;
      }
      
      // For all sections, make active when scrolled past its top
      if (scrollPosition >= sectionTop) {
        setActiveSection(id);
        return;
      }
    }
  }, [navItems]);

  // Smooth scroll to section with better mobile handling
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Tell our scroll handler we're doing a programmatic scroll
    window.isScrollingProgrammatically = true;
    
    // Calculate position
    const offset = 80; // Navbar height
    const elementPosition = element.offsetTop - offset;
    
    // Set active immediately for better UX feedback
    setActiveSection(id);
    
    // Perform smooth scroll
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
    
    // Reset the flag after scrolling animation likely completes
    setTimeout(() => {
      window.isScrollingProgrammatically = false;
    }, 1000);
  }, []);

  // Set up scroll event listener with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      calculateActiveSection();
    }, 200); // Increased throttle to 200ms for more stability
    
    window.addEventListener('scroll', handleScroll);
    
    // Calculate initial active section
    calculateActiveSection();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [calculateActiveSection]);

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