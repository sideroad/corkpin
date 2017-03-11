import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const logo = require('../images/logo.png');
const styles = require('../css/header.less');

const Header = ({ homeURL }) =>
  <header
    className={styles.header}
  >
    <div className={styles.logo}>
      <Link to={homeURL} className={styles.link}>
        <img src={logo} alt="corkpin" className={styles.image} />
        <span>Corkpin</span>
      </Link>
    </div>
  </header>;

Header.propTypes = {
  homeURL: PropTypes.string.isRequired
};

export default Header;
