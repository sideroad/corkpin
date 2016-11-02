import React, { PropTypes } from 'react';

const styles = require('../css/background.less');

const Background = ({ image, onMouseDown, onMouseUp, onMouseMove, children, overflow }) =>
  <div
    style={{ backgroundImage: `url(${image})`, overflow }}
    className={styles.background}
    onMouseDown={(evt) => {
      onMouseDown(evt);
    }}
    onMouseUp={(evt) => {
      onMouseUp(evt);
    }}
    onMouseMove={(evt) => {
      onMouseMove(evt);
    }}
  >
    {children}
  </div>;

Background.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseMove: PropTypes.func,
  overflow: PropTypes.string
};

Background.defaultProps = {
  onMouseMove: () => {},
  onMouseUp: () => {},
  onMouseDown: () => {},
  overflow: 'fixed'
};

export default Background;
