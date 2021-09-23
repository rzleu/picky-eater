import React, { useState } from 'react';
import styles from './about.module.css';
import logoTemp from '../../assets/images/logoTemp.png';
import CindyPic from '../../assets/images/CindyPic.png';
import AntPic from '../../assets/images/AntPic.png';
import RichPic from '../../assets/images/RichPic.png';
import DanPic from '../../assets/images/DanPic.png';

import {
  AnimatePresence,
  AnimateSharedLayout,
  motion,
} from 'framer-motion';

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutHeader}>The pickyEatr Team</h1>
      <div className={styles.teamContainer}>
        <div className={styles.teamItems}>
          <div className={styles.teamItem}>
            <img
              src={CindyPic}
              alt="Cindy Jiang"
              className={styles.proPic}
            />
            <div className={styles.nameHeader}>
              <h2>Cindy Jiang</h2>
              <li className={styles.gitHubLink}>
                Favorite food: Enchiladas
              </li>
              <ul>
                <li className={styles.gitHubLink}>
                  <a href="#">GitHub</a>
                </li>
                <li className={styles.linkedInLink}>
                  <a href="#">LinkedIn</a>
                </li>
                <li className={styles.personalSite}>
                  <a href="#">Personal Site</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.teamItemRight}>
            <div className={styles.teamItem}>
              <img
                src={AntPic}
                alt="Anthony Huang"
                className={styles.proPic}
              />
              <div className={styles.nameHeader}>
                <h2>Anthony Huang</h2>
                <li className={styles.gitHubLink}>
                  Favorite food: Enchiladas
                </li>
                <ul>
                  <li className={styles.gitHubLink}>
                    <a href="#">GitHub</a>
                  </li>
                  <li className={styles.linkedInLink}>
                    <a href="#">LinkedIn</a>
                  </li>
                  <li className={styles.personalSite}>
                    <a href="#">Personal Site</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.teamItem}>
            <img
              src={RichPic}
              alt="Richard Leung"
              className={styles.proPic}
            />
            <div className={styles.nameHeader}>
              <h2>Richard Leung</h2>
              <li className={styles.gitHubLink}>
                Favorite food: Enchiladas
              </li>
              <ul>
                <li className={styles.gitHubLink}>
                  <a href="#">GitHub</a>
                </li>
                <li className={styles.linkedInLink}>
                  <a href="#">LinkedIn</a>
                </li>
                <li className={styles.personalSite}>
                  <a href="#">Personal Site</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.teamItemRight}>
            <div className={styles.teamItem}>
              <img
                src={DanPic}
                alt="Daniel Mechenko"
                className={styles.proPic}
              />
              <div className={styles.nameHeader}>
                <h2>Daniel Mechenko</h2>
                <li className={styles.gitHubLink}>
                  Favorite food: Enchiladas
                </li>
                <div>
                  <ul>
                    <li className={styles.gitHubLink}>
                      <a href="#">GitHub</a>
                    </li>
                    <li className={styles.linkedInLink}>
                      <a href="#">LinkedIn</a>
                    </li>
                    <li className={styles.personalSite}>
                      <a href="#">Personal Site</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
