import React, { PropTypes } from 'react';

const styles = require('../css/background.less');

const Background = ({ image, onMoveStart, onMoveEnd, onMove, children, overflow, blur }) =>
  <div
    style={{
      backgroundImage: `url(${image})`,
      overflow,
    }}
    className={`${styles.background} ${blur ? styles.blur : ''}`}
    onMouseDown={(evt) => {
      onMoveStart(evt);
    }}
    onTouchStart={(evt) => {
      onMoveStart(evt.touches[0]);
    }}
    onMouseMove={(evt) => {
      onMove(evt);
    }}
    onTouchMove={(evt) => {
      onMove(evt.touches[0]);
    }}
    onMouseUp={(evt) => {
      onMoveEnd(evt);
    }}
    onTouchEnd={(evt) => {
      onMoveEnd(evt.touches[0]);
    }}
  >
    {children}
  </div>;

Background.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  overflow: PropTypes.string,
  blur: PropTypes.bool
};

Background.defaultProps = {
  onMoveStart: () => {},
  onMove: () => {},
  onMoveEnd: () => {},
  overflow: 'fixed'
};

export default Background;
