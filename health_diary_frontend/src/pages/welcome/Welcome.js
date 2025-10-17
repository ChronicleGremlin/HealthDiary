import React from 'react';
import styles from '../welcome/Welcome.css';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className={styles['welcome-container']}>
    <div className={styles['welcome-content']}>
      <h1 className={styles['welcome-title']}>WELCOME to your Health Diary</h1>
      <p>The portal will allow you to create, manage and record your daily medical needs</p>
              <Link to="/login" className={styles['cta-button']}>
                Get Started
              </Link>

      </div>

    </div>
  );
};

export default Welcome;