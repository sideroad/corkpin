import React, { PropTypes } from 'react';

const styles = require('../css/modal.less');

const Modal = ({
  display,
  onClose,
  children,
  className = ''
}) =>
  <div
    className={`${styles.modal} ${display ? styles.show : styles.hide} ${className}`}
  >
    <div className={styles.children}>
      {children}
    </div>
    <button
      className={styles.close}
      onClick={
        () => onClose()
      }
    >
      <i className="fa fa-eject" />
    </button>
  </div>;

Modal.propTypes = {
  display: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Modal;
