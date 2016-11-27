import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import { asyncConnect } from 'redux-connect';
import __ from 'lodash';
import Header from '../components/Header';
import Background from '../components/Background';
import Signature from '../components/Signature';
import List from '../components/List';
import uris from '../uris';
import { set } from '../reducers/album';

const styles = require('../css/select-album.less');

const SelectAlbum = ({ route, push, albums, params, user }, { i18n, lang, fetcher }) =>
  <div>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Background image={require('../images/bg.png')} >
      <Signature
        lead={i18n.lead}
        find={i18n.find}
        create={i18n.create}
        findOnFacebook={i18n.find_on_facebook}
        creating
      />
      <List
        className={styles.list}
        items={
          albums.map(
            album => ({
              ...album,
              id: album.id,
              name: album.name,
              image: album.images[0] ? album.images[0].url : ''
            })
          )
        }
        theme="pop"
        hover="cover"
        position="middle"
        onClick={(item) => {
          fetcher.board
            .save({
              album: item.id,
              name: item.name,
              user: user.id,
              background: 'corkboard'
            })
            .catch(() => {})
            .then(
              () => {
                const promises = item.images.map(image =>
                  fetcher.image
                    .save({
                      board: item.id,
                      photo: image.id,
                      name: image.name,
                      url: image.url,
                      x: __.random(document.body.clientWidth / -4, document.body.clientWidth / 4),
                      y: __.random(document.body.clientHeight / -4, document.body.clientHeight / 4),
                      z: 0,
                      width: __.random(250, 300),
                      height: __.random(250, 300)
                    }));
                return Promise.all(promises);
              }
            )
            .then(
              () => fetcher.allow
                .save({
                  board: item.id,
                  user: user.id
                })
            )
            .then(
              () => push(stringify(uris.pages.board, { lang, id: item.id }))
            )
            .catch(
              () => push(stringify(uris.pages.board, { lang, id: item.id }))
            );
        }}
      />
    </Background>
  </div>;

SelectAlbum.propTypes = {
  route: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  albums: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

SelectAlbum.contextTypes = {
  lang: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  fetcher: PropTypes.object.isRequired
};


const connected = connect(
  state => ({
    albums: state.album.items,
    user: state.user.item
  }),
  {
    push,
    set
  }
)(SelectAlbum);

const asynced = asyncConnect([{
  promise: ({ store: { getState }, helpers: { fetcher } }) => {
    const promises = [];
    const user = getState().user.item;
    promises.push(
      fetcher.album
        .gets({
          access_token: user.token,
          fields: 'name'
        })
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
