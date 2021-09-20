import React from 'react';
import styles from './splashpage.module.css';

function SplashPage() {
  return (
    <div className={`h-100 ${styles.splashContainer}`}>
      <h1>pickyEatr</h1>
      <h2>Swipe Right</h2>
      <div className={styles.buttonContainer}>
        <button>Create Account</button>
        <button>Log In</button>
      </div>
    </div>
  );
}

export default SplashPage;
