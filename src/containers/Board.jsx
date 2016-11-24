import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { changeScale, moveStart, moveEnd, pan, setDefault, resetPan, displayMode, editMode, configMode } from '../reducers/board';
import { sizingStart, sizingChange, sizingEnd, draggingStart, draggingEnd } from '../reducers/image';
import { search as searchUser } from '../reducers/user';
import Background from '../components/Background';
import Settings from '../components/Settings';
import Photo from '../components/Photo';

const MouseWheelHandler = (evt, changeScale, mode) => {
  evt.preventDefault();
  if (mode === 'display') {
    changeScale(evt.deltaY);
  }
};

const styles = require('../css/board.less');

// eslint-disable-next-line react/prefer-stateless-function
class Board extends Component {

  componentDidMount() {
    this.MouseWheelHandler = evt => MouseWheelHandler(evt, this.props.changeScale, this.props.mode);
    document.body.addEventListener('mousewheel', this.MouseWheelHandler, false);
    this.props.setDefault(document.body.clientWidth / 2, document.body.clientHeight / 2);
  }
  componentWillUnmount() {
    document.body.removeEventListener('mousewheel', this.MouseWheelHandler, false);
  }

  render() {
    const {
      userId,
      token,
      matchedUsers,
      mode,
      name,
      images,
      params,
      scale,
      moveStart,
      moveEnd,
      pan,
      resetPan,
      moving,
      panX,
      panY,
      defaultX,
      defaultY,
      allows,
      backgrounds,
      background = 'corkboard',
      sizingStart,
      sizingChange,
      sizingEnd,
      draggingStart,
      draggingEnd,
      searchUser,
      configMode,
      displayMode,
      editMode
    } = this.props;
    const { fetcher } = this.context;
    const onMoveStart = (evt) => {
      if (!images.filter(image => image.sizing || image.dragging).length) {
        moveStart(evt.clientX, evt.clientY);
      }
    };
    const onMove = (evt) => {
      if (moving && !images.filter(image => image.sizing || image.dragging).length) {
        pan(evt.clientX, evt.clientY);
      }
    };
    const onMoveEnd = (evt) => {
      if (moving && !images.filter(image => image.sizing || image.dragging).length) {
        pan(evt.clientX, evt.clientY);
      }
      moveEnd();
    };
    return (
      <div className={moving ? styles.grabbing : styles.grab}>
        <Background
          blur={mode === 'config'}
          image={`/images/bg-${background.id}.jpg`}
          overflow="hidden"
          onMouseDown={onMoveStart}
          onTouchStart={onMoveStart}
          onMouseMove={onMove}
          onTouchMove={onMove}
          onMouseUp={onMoveEnd}
          onTouchEnd={onMoveEnd}
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
                    editing={mode === 'edit'}
                    onDragStart={
                      (image) => {
                        moveEnd();
                        if (mode !== 'edit') {
                          return;
                        }
                        let maxZ = 0;
                        images.forEach((image) => {
                          maxZ = maxZ > image.z ? maxZ : image.z;
                        });
                        draggingStart({
                          ...image,
                          z: maxZ + 1
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
                        if (mode !== 'edit') {
                          return;
                        }
                        draggingEnd(image);
                        fetcher.image
                          .update({
                            id: image.id,
                            // TODO: scale logic, remove magic number as 10
                            x: image.left + panX - defaultX + 10,
                            y: image.top + panY - defaultY - 10
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
                        if (mode !== 'edit') {
                          return;
                        }
                        let maxZ = 0;
                        images.forEach((image) => {
                          maxZ = maxZ > image.z ? maxZ : image.z;
                        });
                        sizingStart({
                          ...image,
                          z: maxZ + 1
                        });
                        fetcher.image
                          .update({
                            id: image.id,
                            z: maxZ + 1
                          });
                      }
                    }
                    onSizing={
                      (image) => {
                        if (mode !== 'edit') {
                          return;
                        }
                        sizingChange({
                          id: image.id,
                          width: image.width + (panX - defaultX),
                          height: image.height + (panY - defaultY)
                        });
                      }
                    }
                    onSizingEnd={
                      (image) => {
                        if (mode !== 'edit') {
                          return;
                        }
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
        <button
          className={`${styles.centering} ${mode === 'edit' ? styles.editing : ''}`}
          onClick={
            () => {
              resetPan();
              const promises = images.map(image =>
                fetcher.image
                  .update({
                    id: image.id,
                    // TODO: scale logic, remove magic number as 10
                    x: image.x - panX,
                    y: image.y - panY
                  })
              );
              Promise
                .all(promises)
                .then(
                  () => fetcher.image
                    .gets({
                      board: params.id
                    })
                );
            }
          }
        >
          <i className="fa fa-crosshairs" />
        </button>
        <button
          className={`${styles.edit} ${mode === 'edit' ? styles.editing : ''}`}
          onClick={
            () => {
              if (mode === 'edit') {
                displayMode();
              } else {
                editMode();
              }
            }
          }
        >
          <i className="fa fa-paint-brush" />
        </button>
        <button
          className={styles.config}
          onClick={
            () => configMode()
          }
        >
          <i className="fa fa-cog" />
        </button>
        <Settings
          userId={userId}
          display={mode === 'config'}
          name={name}
          background={background}
          backgrounds={backgrounds}
          allows={allows}
          users={matchedUsers}
          onSearchUser={
            query => searchUser(query)
          }
          onChangeBoardName={
            name => fetcher.board
              .update({
                id: params.id,
                name
              })
              .then(
                () => fetcher.board.get({
                  id: params.id
                })
              )
          }
          onAddUser={
            user => fetcher.allow
              .save({
                board: params.id,
                user
              })
              .then(
                () => fetcher.allow.gets({
                  board: params.id,
                  access_token: token
                })
              )
          }
          onDeleteUser={
            user => fetcher.allow
              .delete({
                board: params.id,
                user
              })
              .then(
                () => fetcher.allow.gets({
                  board: params.id,
                  access_token: token
                })
              )
          }
          onClose={
            () => displayMode()
          }
        />
      </div>
    );
  }
}

Board.propTypes = {
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  matchedUsers: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  backgrounds: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
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
  resetPan: PropTypes.func.isRequired,
  panX: PropTypes.number.isRequired,
  panY: PropTypes.number.isRequired,
  defaultX: PropTypes.number.isRequired,
  defaultY: PropTypes.number.isRequired,
  background: PropTypes.object.isRequired,
  moving: PropTypes.bool.isRequired,
  allows: PropTypes.array.isRequired,
  searchUser: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  displayMode: PropTypes.func.isRequired,
  editMode: PropTypes.func.isRequired,
  configMode: PropTypes.func.isRequired
};

Board.contextTypes = {
  fetcher: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    mode: state.board.mode,
    name: state.board.item.name,
    scale: state.board.scale,
    moving: state.board.moving,
    panX: state.board.panX,
    panY: state.board.panY,
    defaultX: state.board.defaultX,
    defaultY: state.board.defaultY,
    background: state.board.item.background,
    images: state.image.items,
    backgrounds: state.background.items,
    user: state.user.item,
    token: state.user.item.token,
    userId: state.user.item.id,
    users: state.user.items,
    matchedUsers: state.user.matched,
    allows: state.allow.items,
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
    resetPan,
    setDefault,
    searchUser,
    displayMode,
    editMode,
    configMode
  }
)(Board);

const asynced = asyncConnect([{
  promise: ({ store: { getState }, helpers: { fetcher }, params }) => {
    const promises = [];
    const user = getState().user.item;
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
    promises.push(fetcher.allow
      .gets({
        board: id,
        access_token: user.token
      })
    );
    promises.push(fetcher.user
      .gets({
        access_token: user.token
      })
    );
    promises.push(fetcher.background
      .gets({})
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
