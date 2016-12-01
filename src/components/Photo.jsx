import React, { PropTypes, Component } from 'react';
import url from 'url';

const styles = require('../css/photo.less');

class Photo extends Component {
  render() {
    const {
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
    } = this.props;
    return (
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
              left: (evt.clientX / scale),
              top: (evt.clientY / scale)
                  - evt.target.offsetHeight // calculate from the posision
                  - 10 // top padding
            });
          }
        }}
      >
        {
          /\.(jpg|png|gif)$/.test(url.parse(image).pathname) ?
            <div
              className={styles.image}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url(${image})`
              }}
            />
          :
            <video
              muted
              controls
              loop
              autoPlay
              style={{
                width: `${width}px`,
                height: `${height}px`
              }}
            >
              <source src={image} />
            </video>
        }
        {description ?
          <div
            ref={(elem) => { this.descriptionDOM = elem; }}
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
              onMouseDown={(evt) => {
                evt.preventDefault();
                onSizingStart({ id, focus: 'bottomright' });
                return false;
              }}
              onMouseMove={(evt) => {
                if (sizing) {
                  onSizing({
                    id,
                    // TODO: Be able to specify photo padding in board
                    width: (evt.clientX) - (left) - 20, // padding from parent left + right
                    height: (evt.clientY) - (top) - 20  // padding from parent top + bottom
                          - (this.descriptionDOM ? this.descriptionDOM.offsetHeight : 0)
                          // description height
                  });
                }
              }}
              onMouseUp={(evt) => {
                if (sizing) {
                  onSizingEnd({
                    id,
                    width: (evt.clientX) - (left) - 20, // padding from parent left + right
                    height: (evt.clientY) - (top) - 20  // padding from parent top + bottom
                          - (this.descriptionDOM ? this.descriptionDOM.offsetHeight : 0)
                          // description height
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
      </div>
    );
  }
}

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
