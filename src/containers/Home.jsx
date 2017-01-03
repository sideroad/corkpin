import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import uris from '../uris';
import Header from '../components/Header';
import Background from '../components/Background';
import Signature from '../components/Signature';
import Footer from '../components/Footer';
import { configMode } from '../reducers/board';

const Home = ({ route, push, user, configMode }, { i18n, lang, fetcher, cookie }) =>
  <div>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Background image={require('../images/bg.png')} >
      <Signature
        lead={i18n.lead}
        find={user.id ? i18n.find_board : ''}
        create={user.id ? i18n.create : ''}
        start={user.id ? '' : i18n.start}
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
    </Background>
    <Footer privacyPolicyURL={stringify(uris.pages.privacy, { lang })} />
  </div>;

Home.propTypes = {
  route: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  configMode: PropTypes.func.isRequired
};

Home.contextTypes = {
  fetcher: PropTypes.object.isRequired,
  cookie: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
};


const connected = connect(
  state => ({
    user: state.user.item
  }),
  {
    push,
    configMode
  }
)(Home);

export default connected;
