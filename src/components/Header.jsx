import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const styles = require('../css/header.less');

const Header = ({ homeURL }) =>
  <header
    className={styles.header}
  >
    <div className={styles.logo}>
      <Link to={homeURL} >
        Corkpin
      </Link>
    </div>
  </header>;

Header.propTypes = {
  homeURL: PropTypes.string.isRequired
};

export default Header;
