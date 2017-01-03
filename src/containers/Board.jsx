import __ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { v4 } from 'uuid';
import isVideo from 'is-video';
import { changeScale, moveStart, moveEnd, pan, setDefault, resetPan, displayMode, editMode, addMode, configMode, uploadMode } from '../reducers/board';
import { sizingStart, sizingChange, sizingEnd, draggingStart, draggingEnd } from '../reducers/image';
import { search as searchUser, blur as blurUser } from '../reducers/user';
import Background from '../components/Background';
import Settings from '../components/Settings';
import Photo from '../components/Photo';
import MultiSelector from '../components/MultiSelector';
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
      blurUser,
      configMode,
      displayMode,
      editMode,
      addMode,
      uploadMode,
      media,
    } = this.props;
    const { fetcher } = this.context;
    return (
      <div className={moving ? styles.grabbing : styles.grab}>
        <Background
          blur={mode === 'config' || mode === 'add' || mode === 'upload'}
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
                          });
                      }
                    }
                    onDelete={
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
                  />
                )
              }
            </div>
          </div>
        </Background>
        <button
          className={`${styles.adding} ${mode === 'edit' ? styles.editing : ''}`}
          onClick={
            () => addMode()
          }
        >
          <i className="fa fa-facebook-official" />
        </button>
        <button
          className={`${styles.uploading} ${mode === 'edit' ? styles.editing : ''}`}
          onClick={
            () => uploadMode()
          }
        >
          <i className="fa fa-plus-circle" />
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
          lead={'Upload from your device'}
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
                  })
              );
            }
          }
        />
        <MultiSelector
          lead={'Import from Facebook'}
          display={mode === 'add'}
          items={
            media
              .concat(this.props.videos)
              .map((medium) => {
                const image = __.find(images, { photo: medium.id });
                if (image) {
                  return { ...medium, ...image, selected: true, name: 'inserted' };
                }
                return { ...medium, name: '' };
              })
          }
          onClose={
            () => editMode()
          }
          onSelect={
            (item, selected) => {
              if (selected) {
                fetcher.image
                  .save({
                    board: params.id,
                    photo: item.id,
                    name: item.name,
                    url: item.video || item.image,
                    isVideo: Boolean(item.video),
                    x: __.random(document.body.clientWidth / -4, document.body.clientWidth / 4),
                    y: __.random(document.body.clientHeight / -4, document.body.clientHeight / 4),
                    z: getMaxZ(images) + 1,
                    width: __.random(250, 300),
                    height: __.random(250, 300)
                  })
                  .then(
                    () => fetcher.image.gets({
                      board: params.id
                    })
                  );
              } else {
                fetcher.image
                  .delete({
                    id: item.id
                  })
                  .then(
                    () => fetcher.image.gets({
                      board: params.id
                    })
                  );
              }
            }
          }
          onReachToBottom={
            () => {
              if (this.props.mediaHasNext) {
                fetcher.media.gets.next();
              } else if (!this.props.videoIsLoaded) {
                fetcher.video.gets({
                  access_token: token
                });
              } else if (this.props.videoHasNext) {
                fetcher.video.gets.next();
              }
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
          onBlurUser={
            () => blurUser()
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
  media: PropTypes.array.isRequired,
  mediaHasNext: PropTypes.bool.isRequired,
  searchUser: PropTypes.func.isRequired,
  blurUser: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  displayMode: PropTypes.func.isRequired,
  editMode: PropTypes.func.isRequired,
  addMode: PropTypes.func.isRequired,
  uploadMode: PropTypes.func.isRequired,
  configMode: PropTypes.func.isRequired,
  videos: PropTypes.array.isRequired,
  videoHasNext: PropTypes.bool.isRequired,
  videoIsLoaded: PropTypes.bool.isRequired,
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
    media: state.media.items,
    mediaHasNext: state.media.hasNext,
    videos: state.video.items,
    videoHasNext: state.video.hasNext,
    videoIsLoaded: state.video.loaded
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
    blurUser,
    displayMode,
    editMode,
    addMode,
    uploadMode,
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
    promises.push(fetcher.media
      .gets({
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
