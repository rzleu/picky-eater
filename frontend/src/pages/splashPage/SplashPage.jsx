import React from 'react';
import LoginForm from '../../components/session/Login';
import SignupForm from '../../components/session/Signup';
import styles from './splashpage.module.css';
import logoTemp from '../../assets/images/logoTemp.png';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/sessionActions';
import { useHistory } from 'react-router-dom';

function SplashPage() {
  const dispatch = useDispatch();
  const currUser = useSelector((state) => state.session);
  const history = useHistory();
  const user = { username: 'dmech', password: 'Password1!' };

  const handleClick = () => {
    const loginDemo = login(user);
    loginDemo(dispatch).then(() => history.go(0));
  };
  console.log({ currUser });
  return (
    <div className={`h-100 ${styles.splashContainer}`}>
      <h1 className={styles.headerLogo}>
        <img className={styles.splashLogo} src={logoTemp} alt="" />
        pickyEatr
      </h1>

      <h2>Grab a Friend and Swipe Right!</h2>
      <div className={styles.buttonContainer}>
        <SignupForm splashBtn={styles.splashBtn1} />
        <LoginForm splashBtn={styles.splashBtn2} />
        <button className={styles.splashBtn3} onClick={handleClick}>
          Continue to App
        </button>
      </div>
    </div>
  );
}

export default SplashPage;
