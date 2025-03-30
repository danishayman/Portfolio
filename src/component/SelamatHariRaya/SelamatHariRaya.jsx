import React, { useState, useEffect } from 'react';
import styles from './SelamatHariRaya.module.css';
import rewardImage from '../../assets/cervical.webp';

function SelamatHariRaya() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [password, setPassword] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [attemptsExhausted, setAttemptsExhausted] = useState(false);

  // Add useEffect to handle body scroll and check attempts
  useEffect(() => {
    // When component mounts, disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Check if we have stored attempts
    const storedAttempts = localStorage.getItem('passwordAttempts');
    if (storedAttempts) {
      const attempts = parseInt(storedAttempts, 10);
      setAttemptCount(attempts);
      
      // Check if attempts are exhausted
      if (attempts >= 2) {
        setAttemptsExhausted(true);
      }
    }
    
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
    
    // Check if attempts are exhausted
    if (attemptsExhausted) {
      return;
    }
    
    if (password === "Muhammad Danish Aiman Bin Muhammad Nazir") {
      setPasswordError(false);
      setShowReward(true);
      
      // Store success in localStorage to prevent need for future attempts
      localStorage.setItem('passwordSuccess', 'true');
      
      // Add a slight delay to ensure the image appears before scrolling
      setTimeout(() => {
        // Scroll to the reward container
        const rewardContainer = document.querySelector(`.${styles.rewardContainer}`);
        if (rewardContainer) {
          rewardContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      // Increment attempt count
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      localStorage.setItem('passwordAttempts', newAttemptCount.toString());
      
      // Check if attempts are now exhausted
      if (newAttemptCount >= 2) {
        setAttemptsExhausted(true);
      }
      
      setPasswordError(true);
      setShowReward(false);
    }
  };

  // Check for previously successful attempts
  useEffect(() => {
    const hasSucceeded = localStorage.getItem('passwordSuccess') === 'true';
    if (hasSucceeded) {
      setShowReward(true);
      setPasswordError(false);
    }
  }, []);

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
                  <label htmlFor="password">
                    Password: Nama penuh owner 
                    <span className={styles.passwordWarning}>
                      Warning: boleh try 2 kali saja
                    </span>
                    {!attemptsExhausted && attemptCount > 0 && (
                      <span className={styles.attemptCounter}>
                        (Percubaan yang tinggal: {2 - attemptCount})
                      </span>
                    )}
                  </label>
                  <input 
                    type="text" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className={passwordError ? styles.passwordError : ''}
                    placeholder="Enter password"
                    disabled={attemptsExhausted}
                  />
                  <button 
                    type="submit" 
                    className={styles.passwordSubmit}
                    disabled={attemptsExhausted}
                  >
                    Submit
                  </button>
                </div>
                {passwordError && !attemptsExhausted && <p className={styles.errorMessage}>salah weeiiiii !!!</p>}
                {attemptsExhausted && !showReward && (
                  <div className={styles.exhaustedMessage}>
                    <p>Alamak! Dah habis percubaan. Duit raya melayang... 😭</p>
                    <p className={styles.exhaustedSubtext}>Cuba lagi tahun depan!</p>
                  </div>
                )}
              </form>
              
              {/* Reward Image and Tahniah Message */}
              {showReward && (
                <div className={styles.rewardContainer}>
                  <div className={styles.tahniahMessage}>
                    <h3 className={styles.tahniahTitle}>🎉🎊 TAHNIAH!!! 🎉🎊</h3>
                    <p className={styles.tahniahText}>Kalau dah fully calimed, cuba lagi tahun depan 😂</p>
                  </div>
                  <img 
                    src={rewardImage}
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