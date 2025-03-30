import React, { useState, useEffect } from 'react';
import styles from './SelamatHariRaya.module.css';

function SelamatHariRaya() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [password, setPassword] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "Muhammad Danish Aiman Bin Muhammad Nazir") {
      setPasswordError(false);
      setShowReward(true);
      
      // Add a slight delay to ensure the image appears before scrolling
      setTimeout(() => {
        // Scroll to the reward container
        const rewardContainer = document.querySelector(`.${styles.rewardContainer}`);
        if (rewardContainer) {
          rewardContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      setPasswordError(true);
      setShowReward(false);
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
            
            {/* Password Challenge Section */}
            <div className={styles.passwordChallenge}>
              <p className={styles.challengeText}>Nak duit raya?</p>
              <form onSubmit={handlePasswordSubmit}>
                <div className={styles.passwordInputGroup}>
                  <label htmlFor="password">Password: Nama penuh owner</label>
                  <input 
                    type="text" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className={passwordError ? styles.passwordError : ''}
                    placeholder="Enter password"
                  />
                  <button type="submit" className={styles.passwordSubmit}>Submit</button>
                </div>
                {passwordError && <p className={styles.errorMessage}>salah weeiiiii !!!</p>}
              </form>
              
              {/* Reward Image and Tahniah Message */}
              {showReward && (
                <div className={styles.rewardContainer}>
                  <div className={styles.tahniahMessage}>
                    <h3 className={styles.tahniahTitle}>🎉🎊 TAHNIAH!!! 🎉🎊</h3>
                    <p className={styles.tahniahText}>Kalau dah fully calimed, cuba lagi tahun depan 😂</p>
                  </div>
                  <img 
                    src="src\assets\cervical.webp"
                    alt="Reward Image" 
                    className={styles.rewardImage} 
                    onLoad={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelamatHariRaya;