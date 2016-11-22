import React, { PropTypes } from 'react';

const styles = require('../css/selector.less');

const Selector = props =>
  <div
    className={styles.selector}
  >
    {props.lead}
  </div>;

Selector.propTypes = {
  lead: PropTypes.string.isRequired
};

export default Selector;
