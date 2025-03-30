import React, { useState, useEffect } from 'react';
import styles from './SelamatHariRaya.module.css';

function SelamatHariRaya() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Add useEffect to handle body scroll
  useEffect(() => {
    // When component mounts, disable scrolling
    document.body.style.overflow = 'hidden';
    
    // When component unmounts, re-enable scrolling
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const handleEnvelopeClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      
      // Increased timeout to account for refined animations
      setTimeout(() => {
        setShowGreeting(true);
      }, 1500); // Adjusted from 1200ms to 1500ms to match refined animation duration
    }
  };

  return (
    <div className={styles.container}>
      {!showGreeting ? (
        <div className={styles.envelopeWrapper}>
          <div 
            className={`${styles.envelope} ${isOpen ? styles.open : ''}`} 
            onClick={handleEnvelopeClick}
          >
            {!isOpen && (
              <div className={styles.promptContainer}>
                <p className={styles.prompt}>Click to open</p>
              </div>
            )}
            
            <div className={styles.flap}></div>
            <div className={styles.front}></div>
            <div className={styles.pocket}></div>
          </div>
        </div>
      ) : (
        <div className={styles.greetingPage}>
          <div className={styles.greetingCard}>
            <h1 className={styles.title}>Selamat Hari Raya</h1>
            <h2 className={styles.subtitle}>Aidilfitri</h2>
            <div className={styles.decoration}></div>
            <p className={styles.message}>Maaf Zahir & Batin</p>
            <p className={styles.wishes}>Salam lebaran! Moga Raya kali ini penuh dengan kemaafan <br />(dan duit raya)</p>
            <p className={styles.from}>From: danishayman</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelamatHariRaya;