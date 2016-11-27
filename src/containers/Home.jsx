import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import uris from '../uris';
import Header from '../components/Header';
import Background from '../components/Background';
import Signature from '../components/Signature';
import Footer from '../components/Footer';

import { set as setUser } from '../reducers/user';

const Home = ({ route, push, setUser }, { i18n, lang }) =>
  <div>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Background image={require('../images/bg.png')} >
      <Signature
        lead={i18n.lead}
        find={i18n.find_board}
        create={i18n.create}
        findOnFacebook={i18n.find_on_facebook}
        onSubmit={(values) => {
          console.log(values);
        }}
        onClickFind={() => {
          push(stringify(uris.pages.finding, { lang }));
        }}
        onClickCreate={() => {
          push(stringify(uris.pages.creating, { lang }));
        }}
      />
    </Background>
    <Footer privacyPolicyURL={stringify(uris.pages.privacy, { lang })} />
  </div>;

Home.propTypes = {
  route: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
};

Home.contextTypes = {
  fetcher: PropTypes.object.isRequired,
  cookie: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired
};


const connected = connect(
  state => state,
  {
    push,
    setUser
  }
)(Home);

export default connected;
