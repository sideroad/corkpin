import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { changeScale, moveStart, moveEnd, pan } from '../reducers/board';
import { sizingStart, sizingChange, sizingEnd, draggingStart, draggingEnd } from '../reducers/image';
import Background from '../components/Background';
import Photo from '../components/Photo';

const styles = require('../css/board.less');

// eslint-disable-next-line react/prefer-stateless-function
class Board extends Component {
  componentDidMount() {
    const MouseWheelHandler = (evt) => {
      evt.preventDefault();
      console.log(this.props.changeScale);
      this.props.changeScale(evt.deltaY);
    };
    document.body.addEventListener('mousewheel', MouseWheelHandler, false);
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
      user,
      sizingStart,
      sizingChange,
      sizingEnd,
      draggingStart,
      draggingEnd,
    } = this.props;
    const { fetcher } = this.context;
    console.log(panX * -1, panY * -1);
    return (
      <div className={moving ? styles.grabbing : styles.grab}>
        <Background
          image={require('../images/woodboard.jpg')}
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
                transform: `translate(${panX * -1}px, ${panY * -1}px)`
              }}
            >
              {
                images.map(image =>
                  <Photo
                    key={image.id}
                    id={image.id}
                    image={image.source}
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
                            x: image.left + (panX / scale),
                            y: image.top + (panY / scale)
                          })
                          .then(
                            () => fetcher.image
                              .gets({
                                board: params.id,
                                token: user.token
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
                          width: image.width,
                          height: image.height
                        });
                      }
                    }
                    onSizingEnd={
                      (image) => {
                        sizingEnd(image);
                        fetcher.image
                          .update({
                            id: image.id,
                            width: image.width,
                            height: image.height
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
  pan: PropTypes.func.isRequired,
  panX: PropTypes.number.isRequired,
  panY: PropTypes.number.isRequired,
  moving: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
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
    panY: state.board.panY
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
    pan
  }
)(Board);

const asynced = asyncConnect([{
  promise: ({ store: { getState }, helpers: { fetcher }, params }) => {
    const promises = [];
    const id = params.id;
    const user = getState().user.item;

    promises.push(fetcher.board
      .get({
        id
      })
    );
    promises.push(fetcher.image
      .gets({
        board: id,
        token: user.token
      })
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
