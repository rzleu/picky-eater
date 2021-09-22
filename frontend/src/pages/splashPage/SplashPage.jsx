import { motion } from 'framer-motion';
import React from 'react';
import LoginForm from '../../components/session/Login';
import SignupForm from '../../components/session/Signup';
import styles from './splashpage.module.css';

function SplashPage() {
  return (
    <div className={`h-100 ${styles.splashContainer}`}>
      <h1>
        {/* {' '}
        <img src="../../assets/images/logoTemp.png" alt="" />{' '} */}
        pickyEatr
      </h1>
      <h2>Swipe Right</h2>
      <div className={styles.buttonContainer}>
        {/* <button>Create Account</button> */}
        <SignupForm splashBtn={styles.splashBtn1} />
        {/* <button className={styles.splashBtn2}>Log In</button> */}
        <LoginForm splashBtn={styles.splashBtn2} />
      </div>
    </div>
  );
}

export default SplashPage;
