import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Navigation.module.css';
import { Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const { isTransitioning } = useTheme();
  const scrollLock = useRef(false);
  const mobileNavRef = useRef(null);
  const resizeObserver = useRef(null);

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  // Simplified scroll handler with intersection observer
  const updateActiveSection = useCallback(() => {
    if (scrollLock.current) return;

    const sections = navItems.map(item => document.getElementById(item.id));
    const visibleSections = sections.filter(section => {
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
    });

    if (visibleSections.length > 0) {
      const topSection = visibleSections.reduce((prev, current) => 
        prev.getBoundingClientRect().top < current.getBoundingClientRect().top ? prev : current
      );
      setActiveSection(topSection.id);
    }
  }, [navItems]);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollLock.current) {
      requestAnimationFrame(updateActiveSection);
    }
  }, [updateActiveSection]);

  // Improved scroll-to-section with momentum handling
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (!element) return;

    scrollLock.current = true;
    setActiveSection(id);

    const isMobile = window.innerWidth <= 768;
    const navHeight = mobileNavRef.current?.offsetHeight || 0;
    const offset = isMobile ? navHeight + 20 : 80;

    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: 'smooth'
    });

    // Handle momentum scroll on iOS
    let lastScrollPosition = window.scrollY;
    const momentumCheck = setInterval(() => {
      if (Math.abs(window.scrollY - lastScrollPosition) < 1) {
        clearInterval(momentumCheck);
        scrollLock.current = false;
        updateActiveSection();
      }
      lastScrollPosition = window.scrollY;
    }, 100);

    // Fallback unlock
    setTimeout(() => {
      scrollLock.current = false;
      clearInterval(momentumCheck);
    }, 2000);
  }, [updateActiveSection]);

  // Setup event listeners and observers
  useEffect(() => {
    const passiveOptions = { passive: true };
    
    // Use IntersectionObserver for better performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !scrollLock.current) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    });

    navItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    // Handle resize events with observer
    resizeObserver.current = new ResizeObserver(() => {
      updateActiveSection();
    });
    resizeObserver.current.observe(document.documentElement);

    window.addEventListener('scroll', handleScroll, passiveOptions);

    return () => {
      observer.disconnect();
      resizeObserver.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, navItems, updateActiveSection]);

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
      <nav 
        ref={mobileNavRef}
        className={`${styles.mobileNav} ${isTransitioning ? styles.transitioning : ''}`}
      >
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