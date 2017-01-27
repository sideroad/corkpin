import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import { Cards } from 'koiki-ui';
import uris from '../uris';
import Header from '../components/Header';
import Background from '../components/Background';
import Signature from '../components/Signature';
import Footer from '../components/Footer';
import { configMode } from '../reducers/board';

const styles = require('../css/home.less');

const Home = ({ route, push, user, configMode, loadingBoards }, { i18n, lang, fetcher, cookie }) =>
  <div>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Background video="/images/herovideo.mp4" >
      <Signature
        lead={i18n.lead}
        find={user.id ? i18n.find_board : ''}
        create={user.id ? i18n.create : ''}
        start={user.id ? '' : i18n.start}
        loadingBoards={loadingBoards}
        onClickFind={() => {
          push(stringify(uris.pages.finding, { lang }));
        }}
        onClickCreate={() => {
          fetcher.board
            .save({
              name: 'Untitled',
              user: user.id,
              background: 'corkboard'
            })
            .then(
              res =>
                fetcher.allow
                  .save({
                    board: res.body.id,
                    user: user.id
                  })
                  .then(() => ({ id: res.body.id }))
            )
            .then(
              (res) => {
                configMode();
                push(stringify(uris.pages.board, { lang, id: res.id }));
              }
            )
            .catch(
              err => console.error(err)
            );
        }}
        onClickStart={() => {
          cookie.set('redirect', '/', {
            path: '/'
          });
          location.href = uris.pages.login;
        }}
        type="starting"
      />
      <div
        className={styles.block}
      >
        <h1
          className={styles.header}
        >Corkpin for...</h1>
        <Cards
          className={styles.list}
          hasSpace
          theme="pop"
          position="bottom"
          nowrap={false}
          clickable={false}
          items={[
            {
              id: 'albums',
              image: '/images/bg-corkboard.jpg',
              title: 'Trip, party album. Make and share with your friends'
            },
            {
              id: 'portfolio',
              image: '/images/bg-corkboard.jpg',
              title: 'Portfolio. Gather your favorite item photos'
            },
            {
              id: 'greeting',
              image: '/images/bg-corkboard.jpg',
              title: 'Greeting. Post card and greeting all over the world'
            }
          ]}
        />
        <Footer privacyPolicyURL={stringify(uris.pages.privacy, { lang })} />
      </div>
    </Background>
  </div>;

Home.propTypes = {
  route: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  configMode: PropTypes.func.isRequired,
  loadingBoards: PropTypes.bool.isRequired
};

Home.contextTypes = {
  fetcher: PropTypes.object.isRequired,
  cookie: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
};


const connected = connect(
  state => ({
    user: state.user.item,
    loadingBoards: state.board.loading,
  }),
  {
    push,
    configMode
  }
)(Home);

export default connected;
