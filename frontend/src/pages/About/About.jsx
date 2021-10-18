import React from 'react';
import { Link } from 'react-router-dom';

import styles from './about.module.css';
import CindyPic from '../../assets/images/CindyPic.png';
import AntPic from '../../assets/images/AntPic.png';
import RichPic from '../../assets/images/RichPic.jpeg';
import DanPic from '../../assets/images/DanPic.png';
import gitHub from '../../assets/images/github-alt-brands.png';
import linkedIn from '../../assets/images/linkedin-brands.png';
import globe from '../../assets/images/globe-solid.png';
import logoTemp from '../../assets/images/logoTemp.png';

function About() {
  return (
    <div className={styles.aboutContainer}>
      <Link to="/" className={styles.headerLogo}>
        <img className={styles.splashLogo} src={logoTemp} alt="" />
      </Link>
      <h1 className={styles.aboutHeader}>The pickyEatr Team</h1>
      <div className={styles.teamContainer}>
        <div className={styles.teamItems}>
          <div className={styles.teamItemLeft}>
            <div className={styles.teamItem}>
              <img
                src={CindyPic}
                alt="Cindy Jiang"
                className={styles.proPic}
              />
              <div className={styles.nameHeader}>
                <h2>Cindy Jiang</h2>
                <li className={styles.favFood}>
                  Favorite food: Cacio e Pepe
                </li>
                <ul>
                  <li className={styles.gitHubLink}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/cindyj301"
                    >
                      <img src={gitHub} alt="gitHub" />
                    </a>
                  </li>
                  <li className={styles.linkedInLink}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.linkedin.com/in/jiang-cindy/"
                    >
                      <img src={linkedIn} alt="linkedIn" />
                    </a>
                  </li>
                  <li className={styles.personalSite}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://cindyj301.github.io"
                    >
                      <img src={globe} alt="personalSite" />
                    </a>
                  </li>
                </ul>
              </div>
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
                <li className={styles.favFood}>
                  Favorite food: Korean Fried Chicken
                </li>
                <ul>
                  <li className={styles.gitHubLink}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/anthill499"
                    >
                      <img src={gitHub} alt="gitHub" />
                    </a>
                  </li>
                  <li className={styles.linkedInLink}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.linkedin.com/in/anthonyhuang499/"
                    >
                      <img src={linkedIn} alt="linkedIn" />
                    </a>
                  </li>
                  <li className={styles.personalSite}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.anthonyhuang.dev"
                    >
                      <img src={globe} alt="personalSite" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.teamItemLeft}>
            <div className={styles.teamItem}>
              <img
                src={RichPic}
                alt="Richard Leung"
                className={styles.proPic}
              />
              <div className={styles.nameHeader}>
                <h2>Richard Leung</h2>
                <li className={styles.favFood}>
                  Favorite food: Shakshukah
                </li>
                <ul>
                  <li className={styles.gitHubLink}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/rzleu"
                    >
                      <img src={gitHub} alt="gitHub" />
                    </a>
                  </li>
                  <li className={styles.linkedInLink}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.linkedin.com/in/richardzleung/"
                    >
                      <img src={linkedIn} alt="linkedIn" />
                    </a>
                  </li>
                  <li className={styles.personalSite}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://richzleung.com/"
                    >
                      <img src={globe} alt="personalSite" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.teamItemRight}>
            <div className={styles.teamItemDan}>
              <img
                src={DanPic}
                alt="Daniel Mechenko"
                className={styles.proPic}
              />
              <div className={styles.nameHeader}>
                <h2>Daniel Mechenko</h2>
                <li className={styles.favFood}>
                  Favorite food: Thai Green Curry
                </li>
                <div className={styles.needsWidth}>
                  <ul>
                    <li className={styles.gitHubLink}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/dmechenko"
                      >
                        <img src={gitHub} alt="gitHub" />
                      </a>
                    </li>
                    <li className={styles.linkedInLink}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.linkedin.com/in/dmechenko/"
                      >
                        <img src={linkedIn} alt="linkedIn" />
                      </a>
                    </li>
                    <li className={styles.personalSite}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://dmechenko.github.io/portfoliov1.1/"
                      >
                        <img src={globe} alt="personalSite" />
                      </a>
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
