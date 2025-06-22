import React from 'react';
import styles from './header.module.css';
import schoolLogo from '../../../assets/school-logo.svg';
import Navigation from '../Navigation/Navigation';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <span className={styles.logos}>
        <img src={schoolLogo} alt="school-logo" />
        <span className={styles.productName}>МЕЖГАЛАКТИЧЕСКАЯ АНАЛИТИКА</span>
      </span>
      <Navigation />
    </header>
  );
};

export default Header;
