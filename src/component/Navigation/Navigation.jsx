import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { Home, Briefcase, Laptop, GraduationCap, Code, Mail } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

function Navigation() {
  const [activeSection, setActiveSection] = useState('home');
  const { theme } = useTheme();

  const navItems = [
    { id: 'hero', label: 'HOME', icon: <Home size={18} /> },
    { id: 'education', label: 'EDUCATION', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'SKILLS', icon: <Code size={18} /> },
    { id: 'projects', label: 'PROJECTS', icon: <Laptop size={18} /> },
    { id: 'work', label: 'EXPERIENCE', icon: <Briefcase size={18} /> },
    { id: 'contact', label: 'CONTACT', icon: <Mail size={18} /> },
  ];

  useEffect(() => {
    // Simple intersection observer with no custom behavior
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
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
  }, [navItems]);

  // Simple navigation without any custom scrolling logic
  const navigateToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Just update the active section and let the browser handle scrolling
      element.scrollIntoView();
      setActiveSection(id);
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
                onClick={() => navigateToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation with no custom touch handling */}
      <nav className={styles.mobileNav}>
        <div className={styles.mobileContainer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.mobileNavItem} ${activeSection === item.id ? styles.active : ''}`}
              onClick={() => navigateToSection(item.id)}
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