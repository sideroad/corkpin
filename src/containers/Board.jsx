import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { changeScale, moveStart, moveEnd, pan, setDefault } from '../reducers/board';
import { sizingStart, sizingChange, sizingEnd, draggingStart, draggingEnd } from '../reducers/image';
import Background from '../components/Background';
import Photo from '../components/Photo';

const MouseWheelHandler = (evt, changeScale) => {
  evt.preventDefault();
  changeScale(evt.deltaY);
};

const styles = require('../css/board.less');

// eslint-disable-next-line react/prefer-stateless-function
class Board extends Component {

  componentDidMount() {
    this.MouseWheelHandler = evt => MouseWheelHandler(evt, this.props.changeScale);
    document.body.addEventListener('mousewheel', this.MouseWheelHandler, false);
    this.props.setDefault(document.body.clientWidth / 2, document.body.clientHeight / 2);
  }
  componentWillUnmount() {
    document.body.removeEventListener('mousewheel', this.MouseWheelHandler, false);
  }

  render() {
    const {
      images,
      params,
      scale,
      moveStart,
      moveEnd,
      pan,
      moving,
      panX,
      panY,
      defaultX,
      defaultY,
      background = 'corkboard',
      sizingStart,
      sizingChange,
      sizingEnd,
      draggingStart,
      draggingEnd,
    } = this.props;
    const { fetcher } = this.context;

    return (
      <div className={moving ? styles.grabbing : styles.grab}>
        <Background
          image={background}
          overflow="hidden"
          onMouseDown={(evt) => {
            if (!images.filter(image => image.sizing || image.dragging).length) {
              moveStart(evt.clientX, evt.clientY);
            }
          }}
          onMouseUp={(evt) => {
            if (moving && !images.filter(image => image.sizing || image.dragging).length) {
              pan(evt.clientX, evt.clientY);
            }
            moveEnd();
          }}
          onMouseMove={(evt) => {
            if (moving && !images.filter(image => image.sizing || image.dragging).length) {
              pan(evt.clientX, evt.clientY);
            }
          }}
        >
          <div
            className={styles.scaller}
            style={{
              transform: `scale(${scale})`
            }}
          >
            <div
              className={styles.container}
              style={{
                transform: `translate(${(panX * -1) - (defaultX * -1)}px, ${(panY * -1) - (defaultY * -1)}px)`
              }}
            >
              {
                images.map(image =>
                  <Photo
                    key={image.id}
                    id={image.id}
                    image={image.url}
                    description={image.name}
                    width={image.width}
                    height={image.height}
                    left={image.x}
                    top={image.y}
                    zIndex={image.z}
                    scale={scale}
                    dragging={image.dragging}
                    sizing={image.sizing}
                    focus={image.focus}
                    onDragStart={
                      (image) => {
                        moveEnd();
                        draggingStart(image);
                        let maxZ = 0;
                        images.forEach((image) => {
                          maxZ = maxZ > image.z ? maxZ : image.z;
                        });
                        fetcher.image
                          .update({
                            id: image.id,
                            z: maxZ + 1
                          });
                      }
                    }
                    onDragEnd={
                      (image) => {
                        draggingEnd(image);
                        fetcher.image
                          .update({
                            id: image.id,
                            x: image.left + (panX - defaultX),
                            y: image.top + (panY - defaultY)
                          })
                          .then(
                            () => fetcher.image
                              .gets({
                                board: params.id
                              })
                          );
                      }
                    }
                    onSizingStart={
                      (image) => {
                        moveEnd();
                        sizingStart(image);
                      }
                    }
                    onSizing={
                      (image) => {
                        sizingChange({
                          id: image.id,
                          width: image.width + (panX - defaultX),
                          height: image.height + (panY - defaultY)
                        });
                      }
                    }
                    onSizingEnd={
                      (image) => {
                        sizingEnd(image);
                        fetcher.image
                          .update({
                            id: image.id,
                            width: image.width + (panX - defaultX),
                            height: image.height + (panY - defaultY)
                          });
                      }
                    }
                  />
                )
              }
            </div>
          </div>
        </Background>
      </div>
    );
  }
}

Board.propTypes = {
  images: PropTypes.array.isRequired,
  scale: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired,
  changeScale: PropTypes.func.isRequired,
  moveStart: PropTypes.func.isRequired,
  moveEnd: PropTypes.func.isRequired,
  sizingStart: PropTypes.func.isRequired,
  sizingChange: PropTypes.func.isRequired,
  sizingEnd: PropTypes.func.isRequired,
  draggingStart: PropTypes.func.isRequired,
  draggingEnd: PropTypes.func.isRequired,
  setDefault: PropTypes.func.isRequired,
  pan: PropTypes.func.isRequired,
  panX: PropTypes.number.isRequired,
  panY: PropTypes.number.isRequired,
  defaultX: PropTypes.number.isRequired,
  defaultY: PropTypes.number.isRequired,
  background: PropTypes.string.isRequired,
  moving: PropTypes.bool.isRequired
};

Board.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    images: state.image.items,
    user: state.user.item,
    scale: state.board.scale,
    moving: state.board.moving,
    panX: state.board.panX,
    panY: state.board.panY,
    defaultX: state.board.defaultX,
    defaultY: state.board.defaultY,
    background: state.board.item.background
  }),
  {
    changeScale,
    moveStart,
    moveEnd,
    sizingStart,
    sizingChange,
    sizingEnd,
    draggingStart,
    draggingEnd,
    pan,
    setDefault
  }
)(Board);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher }, params }) => {
    const promises = [];
    const id = params.id;

    promises.push(fetcher.board
      .get({
        id
      })
    );
    promises.push(fetcher.image
      .gets({
        board: id
      })
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
