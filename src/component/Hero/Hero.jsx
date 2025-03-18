import styles from "./Hero.module.css";
import heroImg from "../../assets/hero.png";
import lelouchImg from "../../assets/lelouch.png";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import twitterLight from "../../assets/twitter-light.svg";
import githubLight from "../../assets/github-light.svg";
import linkedinLight from "../../assets/linkedin-light.svg";
import instagramLight from "../../assets/instagram-light.svg";
import twitterDark from "../../assets/twitter-dark.svg";
import githubDark from "../../assets/github-dark.svg";
import linkedinDark from "../../assets/linkedin-dark.svg";
import instagramDark from "../../assets/instagram-dark.svg";
import { useTheme } from "../../common/ThemeContext";
import { useState, useEffect, useRef } from "react";

function Hero() {
  const { theme, toggleTheme } = useTheme();
  const themeIcon = theme === "light" ? sun : moon;
  const twitterIcon = theme === "light" ? twitterLight : twitterDark;
  const githubIcon = theme === "light" ? githubLight : githubDark;
  const linkedinIcon = theme === "light" ? linkedinLight : linkedinDark;
  const instagramIcon = theme === "light" ? instagramLight : instagramDark;
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentImage, setCurrentImage] = useState(theme === "light" ? heroImg : lelouchImg);
  const flipTimeoutRef = useRef(null);
  const animationEndedRef = useRef(null);

  // Preload images
  const preloadImages = (images) => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  useEffect(() => {
    // Preload images when the component mounts
    preloadImages([heroImg, lelouchImg, sun, moon, twitterLight, githubLight, linkedinLight, instagramLight, twitterDark, githubDark, linkedinDark, instagramDark]);
  }, []);

  // Handle image swap during flip animation
  useEffect(() => {
    if (isFlipping) {
      // Clear any existing timeouts
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
      
      // Set the new image halfway through the animation
      flipTimeoutRef.current = setTimeout(() => {
        setCurrentImage(theme === "light" ? heroImg : lelouchImg);
      }, 250); // Adjusted to match the animation midpoint
      
      // End animation after its complete duration
      animationEndedRef.current = setTimeout(() => {
        setIsFlipping(false);
      }, 500); // Match the full animation duration
      
      return () => {
        clearTimeout(flipTimeoutRef.current);
        clearTimeout(animationEndedRef.current);
      };
    }
  }, [isFlipping, theme]);

  const handleThemeToggle = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      toggleTheme();
    }
  };

  return (
    <section id="hero" className={styles.container}>
      <div className={styles.colorModeContainer}>
        <div className={`${styles.imageContainer} ${isFlipping ? styles.flipping : ""}`}>
          <img className={styles.hero} src={currentImage} alt="Profile picture" />
        </div>

        <img
          className={styles.colorMode}
          src={themeIcon}
          alt="Colour mode icon"
          onClick={handleThemeToggle}
        />
      </div>
      <div className={styles.info}>
        <h1>
          Danish
          <br />
          Aiman
        </h1>

        <h2>Computer Science Student</h2>

        <span>
          <a href="https://www.instagram.com/danishayman/" target="_blank">
            <img src={instagramIcon} alt="Instagram icon" />
          </a>
          <a href="https://github.com/danishayman/" target="_blank">
            <img src={githubIcon} alt="Github icon" />
          </a>
          <a href="https://www.linkedin.com/in/danishayman/" target="_blank">
            <img src={linkedinIcon} alt="LinkedIn icon" />
          </a>
        </span>
        <p className={styles.description}>
          A developer majoring in Intelligent Computing. SUPER into Machine
          Learning and Artificial Intelligence.
        </p>
        <a
          href="https://drive.google.com/file/d/1fYD_o_qPofZylzwzJGxuFIu8R8_ExIQx/view?usp=sharing"
          target="_blank"
        >
          <button className="hover">Résumé</button>
        </a>
      </div>
    </section>
  );
}

export default Hero;