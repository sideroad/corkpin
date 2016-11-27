import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import { asyncConnect } from 'redux-connect';
import Header from '../components/Header';
import Background from '../components/Background';
import Signature from '../components/Signature';
import List from '../components/List';
import uris from '../uris';
import { set } from '../reducers/album';

const styles = require('../css/find.less');

const Find = ({ route, push, boards, params, user }, { i18n, lang, fetcher }) =>
  <div className={styles.container}>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Background image={require('../images/bg.png')} >
      <Signature
        lead={i18n.lead}
        find={i18n.find_board}
        create={i18n.create}
        findOnFacebook={i18n.find_on_facebook}
        finding
        onChangeFind={
          (evt) => {
            fetcher.board
              .gets({
                query: evt.target.value
              });
          }
        }
      />
      <List
        className={styles.list}
        items={
          boards.map(
            board => ({
              ...board,
              id: board.id,
              name: board.name,
              image: board.image
            })
          )
        }
        theme="pop"
        hover="cover"
        position="middle"
        onClick={item => push(stringify(uris.pages.board, { lang, id: item.id }))}
      />
    </Background>
  </div>;

Find.propTypes = {
  route: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

Find.contextTypes = {
  lang: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  fetcher: PropTypes.object.isRequired
};


const connected = connect(
  state => ({
    boards: state.board.items,
    user: state.user.item
  }),
  {
    push,
    set
  }
)(Find);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher } }) => {
    const promises = [];
    promises.push(
      fetcher.board
        .gets()
    );
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
