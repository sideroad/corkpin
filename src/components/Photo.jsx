import React, { PropTypes, Component } from 'react';
import isVideo from 'is-video';

const styles = require('../css/photo.less');

// TODO: Double click or Long tap to open photo viewer to see comments
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
      focus,
      onClickDelete,
      onClickConfig
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
          isVideo(image) ?
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
          :
            <div
              className={styles.image}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: image ? `url(${image})` : 'none'
              }}
            />
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
          editing ?
            <div
              className={styles.delete}
            >
              <button
                onClick={
                  (evt) => {
                    evt.preventDefault();
                    onClickDelete(id);
                  }
                }
              >
                <i className="fa fa-trash" />
              </button>
            </div> : ''
          /* TODO: rotate photos
          <div
            className={`${styles.bottom} ${styles.left}`}
          />
          */
        }
        {
          editing ?
            <div
              className={styles.config}
            >
              <button
                onClick={
                  (evt) => {
                    evt.preventDefault();
                    onClickConfig(id);
                  }
                }
              >
                <i className="fa fa-cog" />
              </button>
            </div> : ''
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
  focus: PropTypes.string.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickConfig: PropTypes.func.isRequired
};

export default Photo;
