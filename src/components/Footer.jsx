import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const styles = require('../css/footer.less');

const Footer = ({ privacyPolicyURL }) =>
  <footer
    className={styles.footer}
  >
    <ul className={styles.linkages}>
      <li>
        <Link to={privacyPolicyURL} >
          Privacy Policy
        </Link>
      </li>
    </ul>
  </footer>;

Footer.propTypes = {
  privacyPolicyURL: PropTypes.string.isRequired
};

export default Footer;
