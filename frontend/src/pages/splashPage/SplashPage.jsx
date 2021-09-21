import React from 'react';
import LoginForm from '../../components/session/Login';
import SignupForm from '../../components/session/Signup';
import styles from './splashpage.module.css';

function SplashPage() {
  return (
    <div className={`h-100 ${styles.splashContainer}`}>
      <h1>pickyEatr</h1>
      <h2>Swipe Right</h2>
      <div className={styles.buttonContainer}>
        {/* <button>Create Account</button> */}
        <SignupForm />
        <button className={styles.splashBtn2}>Log In</button>
      </div>
    </div>
  );
}

export default SplashPage;
