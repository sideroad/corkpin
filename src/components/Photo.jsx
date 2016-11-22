import React, { PropTypes } from 'react';

const styles = require('../css/photo.less');

const Photo = ({
  top,
  left,
  zIndex,
  id,
  image,
  onDragStart,
  onDragEnd,
  width,
  height,
  description,
  dragging,
  editing,
  scale,
  onSizingStart,
  onSizing,
  onSizingEnd,
  sizing,
  focus
}) =>
  <div
    className={`${styles.photo} ${dragging ? styles.dragging : ''} ${sizing ? styles.sizing : ''} ${editing ? styles.editing : ''}`}
    style={{
      top: `${top}px`,
      left: `${left}px`,
      zIndex: `${zIndex}`
    }}
    draggable={!sizing && editing}
    onDragStart={() => {
      if (!sizing) {
        onDragStart({ id });
      }
    }}
    onDragEnd={(evt) => {
      console.log(scale, top, left, evt.clientY, evt.clientX, evt.target.offsetHeight);
      if (!sizing) {
        onDragEnd({
          id,
          left: evt.clientX / scale,
          top: (evt.clientY / scale) - evt.target.offsetHeight
        });
      }
    }}
  >
    <div
      className={styles.image}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${image})`
      }}
    />
    {description ?
      <div
        className={styles.description}
        style={{
          width: `${width}px`
        }}
      >
        {description}
      </div> : ''}
    {
      editing ?
        <div className={styles.hover}>
          <i className="fa fa-arrows" />
        </div>
        : ''
    }
    {
      editing ?
        <div
          className={`${styles.bottom} ${styles.right} ${focus === 'bottomright' ? styles.focus : ''}`}
          onMouseDown={() => onSizingStart({ id, focus: 'bottomright' })}
          onMouseMove={(evt) => {
            if (sizing) {
              onSizing({
                id,
                width: (evt.clientX) - (left),
                height: (evt.clientY) - (top)
              });
            }
          }}
          onMouseUp={(evt) => {
            if (sizing) {
              onSizingEnd({
                id,
                width: (evt.clientX) - (left),
                height: (evt.clientY) - (top)
              });
            }
          }}
        /> : ''
    }
    {
      /* TODO: rotate photos
      <div
        className={`${styles.top} ${styles.right}`}
      />
      <div
        className={`${styles.bottom} ${styles.left}`}
      />
      */
    }
  </div>;

Photo.propTypes = {
  id: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string,
  scale: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  zIndex: PropTypes.number.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onSizingStart: PropTypes.func.isRequired,
  onSizing: PropTypes.func.isRequired,
  onSizingEnd: PropTypes.func.isRequired,
  dragging: PropTypes.bool.isRequired,
  sizing: PropTypes.bool.isRequired,
  focus: PropTypes.string.isRequired
};

export default Photo;
