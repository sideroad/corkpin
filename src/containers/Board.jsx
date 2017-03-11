import __ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { v4 } from 'uuid';
import isVideo from 'is-video';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';

import uris from '../uris';
import { changeScale, moveStart, moveEnd, pan, setDefault, resetPan, displayMode, editMode, configMode, uploadMode, photoConfigMode } from '../reducers/board';
import { sizingStart, sizingChange, sizingEnd, draggingStart, draggingEnd } from '../reducers/image';
import { search as searchUser } from '../reducers/user';
import Background from '../components/Background';
import Settings from '../components/Settings';
import PhotoSettings from '../components/PhotoSettings';
import Photo from '../components/Photo';
import Uploader from '../components/Uploader';

// TODO: Be able to add text with WYSWYG
// TODO: Zooming does not start from center of viewport.
// TODO: Pinch out interaction on SmartDevice
const MouseWheelHandler = (evt, changeScale, mode) => {
  if (mode === 'display') {
    evt.preventDefault();
    changeScale(evt.deltaY);
  }
};

const setDefaultPan = (evt, setDefault) => {
  setDefault(document.body.clientWidth / 2, document.body.clientHeight / 2);
};

const getMaxZ = (images) => {
  let maxZ = 0;
  images.forEach((image) => {
    maxZ = maxZ > image.z ? maxZ : image.z;
  });
  return maxZ;
};

const styles = require('../css/board.less');

// eslint-disable-next-line react/prefer-stateless-function
class Board extends Component {

  componentDidMount() {
    this.MouseWheelHandler = evt => MouseWheelHandler(evt, this.props.changeScale, this.props.mode);
    document.body.addEventListener('mousewheel', this.MouseWheelHandler, false);
    this.setDefault = evt => setDefaultPan(evt, this.props.setDefault);
    window.addEventListener('resize', this.setDefault, false);
    this.setDefault();
  }
  componentWillUnmount() {
    document.body.removeEventListener('mousewheel', this.MouseWheelHandler, false);
    window.removeEventListener('resize', this.setDefault, false);
  }

  render() {
    const {
      userId,
      token,
      matchedUsers,
      mode,
      name,
      images,
      photo,
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
      background = { id: 'corkboard' },
      sizingStart,
      sizingChange,
      sizingEnd,
      draggingStart,
      draggingEnd,
      searchUser,
      configMode,
      displayMode,
      editMode,
      uploadMode,
      photoConfigMode,
      push,
    } = this.props;
    const { fetcher, lang } = this.context;
    return (
      <div className={moving ? styles.grabbing : styles.grab}>
        <Background
          blur={mode === 'config' || mode === 'add' || mode === 'upload' || mode === 'photo-config'}
          image={`/images/bg-${background.id}.jpg`}
          overflow="hidden"
          onMoveStart={(evt) => {
            if (!images.filter(image => image.sizing || image.dragging).length) {
              moveStart(evt.clientX, evt.clientY);
            }
          }}
          onMove={(evt) => {
            if (moving && !images.filter(image => image.sizing || image.dragging).length) {
              pan(evt.clientX, evt.clientY);
            }
          }}
          onMoveEnd={(evt) => {
            if (moving &&
                !images.filter(image => image.sizing || image.dragging).length &&
                evt.clientX &&
                evt.clientY
               ) {
              pan(evt.clientX, evt.clientY);
            }
            moveEnd();
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
                            x: image.left + panX - defaultX,
                            y: image.top + panY - defaultY
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
                        const maxZ = getMaxZ(images);
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
                          })
                          .then(
                            () => fetcher.image.gets({
                              board: params.id
                            })
                          );
                      }
                    }
                    onClickDelete={
                      (id) => {
                        fetcher.image
                          .delete({
                            id
                          })
                          .then(
                            () => fetcher.image.gets({
                              board: params.id
                            })
                          );
                      }
                    }
                    onClickConfig={
                      () => {
                        photoConfigMode(image);
                      }
                    }
                  />
                )
              }
            </div>
          </div>
        </Background>
        <button
          className={`${styles.uploading} ${mode === 'edit' ? styles.editing : ''}`}
          onClick={
            () => uploadMode()
          }
        >
          <i className="fa fa-picture-o" />
        </button>
        <button
          className={`${styles.centering} ${mode === 'edit' ? styles.editing : ''}`}
          onClick={
            () => {
              resetPan();
              const promises = images.map(image =>
                fetcher.image
                  .update({
                    id: image.id,
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
            () => {
              if (mode === 'config') {
                displayMode();
              } else {
                configMode();
              }
            }
          }
        >
          <i className="fa fa-cog" />
        </button>
        <Uploader
          lead={'Drop files to upload'}
          display={mode === 'upload'}
          onClose={
            () => editMode()
          }
          onUploaded={
            (err, res) => {
              const promises = res.body.paths.map(path =>
                fetcher.image
                  .save({
                    board: params.id,
                    photo: v4(),
                    name: '',
                    url: path,
                    isVideo: isVideo(path),
                    fromUploader: true,
                    x: __.random(document.body.clientWidth / -4, document.body.clientWidth / 4),
                    y: __.random(document.body.clientHeight / -4, document.body.clientHeight / 4),
                    z: getMaxZ(images) + 1,
                    width: __.random(250, 300),
                    height: __.random(250, 300)
                  })
              );
              Promise.all(promises).then(
                () =>
                  fetcher.image.gets({
                    board: params.id
                  }).then(
                    () => editMode()
                  )
              );
            }
          }
        />
        <Settings
          display={mode === 'config'}
          userId={userId}
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
          onChangeBoardBackground={
            item => fetcher.board
              .update({
                id: params.id,
                background: item.id
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
          onDeleteBoard={
            () => fetcher.board
              .delete({
                id: params.id,
              })
              .then(
                () => push(stringify(uris.pages.root, { lang }))
              )
          }
          onClose={
            () => displayMode()
          }
        />
        <PhotoSettings
          display={mode === 'photo-config'}
          name={photo.name}
          onChangePhotoName={
            name => fetcher.image
              .update({
                id: photo.id,
                name
              })
              .then(
                () => fetcher.image.gets({
                  board: params.id
                })
              )
          }
          onClose={
            () => editMode()
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
  photo: PropTypes.object.isRequired,
  background: PropTypes.object.isRequired,
  moving: PropTypes.bool.isRequired,
  allows: PropTypes.array.isRequired,
  searchUser: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  displayMode: PropTypes.func.isRequired,
  editMode: PropTypes.func.isRequired,
  uploadMode: PropTypes.func.isRequired,
  configMode: PropTypes.func.isRequired,
  photoConfigMode: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

Board.contextTypes = {
  fetcher: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
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
    photo: state.board.photo,
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
    uploadMode,
    configMode,
    photoConfigMode,
    push
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
