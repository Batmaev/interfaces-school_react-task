import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './navigation.module.css';

import analytics from '../../../assets/analytics.svg';
import generate from '../../../assets/generate.svg';
import history from '../../../assets/history.svg';

const Navigation: React.FC = () => {
  return (
    <nav className={styles.navigation}>
      <NavLink to="/">
        <img src={analytics} alt="analytics" />
        CSV Аналитик
      </NavLink>
      <NavLink to="/generate">
        <img src={generate} alt="generate" />
        CSV Генератор
      </NavLink>
      <NavLink to="/history">
        <img src={history} alt="history" />
        История
      </NavLink>
    </nav>
  );
};

export default Navigation;
