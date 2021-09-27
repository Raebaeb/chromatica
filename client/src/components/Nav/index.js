import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import logoMin from '../../assets/logoMin.svg'

const Nav = () => {
  return (
    <header>
      <nav>
        <Link to='/new'>create palette</Link>
      </nav>
        <Link to='/' id='logo-link'>
          <img src={logoMin} id='logo' alt='chromatica logo'/>
        </Link>
    </header>
  );
};

export default Nav;