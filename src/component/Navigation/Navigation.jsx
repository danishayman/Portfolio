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
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 0;

      sections.forEach(section => {
        if (!section) return;
        
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      
      const offset = 80; 
      const elementTop = element.offsetTop - offset;
  
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
  
      setIsMenuOpen(false); // Close the menu after clicking
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