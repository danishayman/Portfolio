import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../common/ThemeContext';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'work', label: 'EXPERIENCE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const offset = 100; // Adjust this value based on your navbar height

      // Get all sections and filter out any null elements
      const sections = navItems
        .map(item => document.getElementById(item.id))
        .filter(Boolean);

      // Find the current section by iterating from bottom to top
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop - offset;

        if (scrollPosition >= sectionTop) {
          setActiveSection(section.id);
          break;
        }
      }

      // Special case for the top of the page
      if (scrollPosition < sections[0].offsetTop - offset) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check for active section
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // This should match your navbar height
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${styles.menuItems} ${isMenuOpen ? styles.open : ''}`}>
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
  );
}

export default Navigation;