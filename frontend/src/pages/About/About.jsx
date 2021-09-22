import React from 'react';
import styles from './about.module.css';
import logoTemp from '../../assets/images/logoTemp.png';

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutHeader}>The Team</h1>
      <div className={styles.teamContainer}>
        <div className={styles.teamItems}>
          <div className={styles.teamItem}>
            <img
              src={logoTemp}
              alt="Cindy Jiang"
              className={styles.proPic}
            />
            <div className={styles.gitHubLink}>
              <a href="#">GitHub</a>
            </div>
            <div className={styles.linkedInLink}>
              <a href="#">LinkedIn</a>
            </div>
          </div>
          <div className={styles.teamItem}>
            <img
              src={logoTemp}
              alt="Cindy Jiang"
              className={styles.proPic}
            />
            <div className={styles.gitHubLink}>
              <a href="#">GitHub</a>
            </div>
            <div className={styles.linkedInLink}>
              <a href="#">LinkedIn</a>
            </div>
          </div>
          <div className={styles.teamItem}>
            <img
              src={logoTemp}
              alt="Cindy Jiang"
              className={styles.proPic}
            />
            <div className={styles.gitHubLink}>
              <a href="#">GitHub</a>
            </div>
            <div className={styles.linkedInLink}>
              <a href="#">LinkedIn</a>
            </div>
          </div>
          <div className={styles.teamItem}>
            <img
              src={logoTemp}
              alt="Cindy Jiang"
              className={styles.proPic}
            />
            <div className={styles.gitHubLink}>
              <a href="#">GitHub</a>
            </div>
            <div className={styles.linkedInLink}>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
