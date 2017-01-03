import React, { PropTypes } from 'react';

import Modal from '../components/Modal';
import List from '../components/List';

const styles = require('../css/multiselector.less');

const MultiSelector = ({
  display,
  onClose,
  items,
  onSelect,
  onReachToBottom,
  lead
}) =>
  <Modal
    display={display}
    onClose={onClose}
  >
    <div className={styles.selector}>
      <div className={styles.lead}>{lead}</div>
      <List
        items={items}
        theme="pop"
        hover="cover"
        position="middle"
        onClick={onSelect}
        onReachToBottom={onReachToBottom}
      />
    </div>
  </Modal>;

MultiSelector.propTypes = {
  lead: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onReachToBottom: PropTypes.func.isRequired
};

export default MultiSelector;
