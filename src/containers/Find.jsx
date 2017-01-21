import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { stringify } from 'koiki';
import { Cards } from 'koiki-ui';
import { asyncConnect } from 'redux-connect';
import Header from '../components/Header';
import Background from '../components/Background';
import Signature from '../components/Signature';
import uris from '../uris';
import { set } from '../reducers/album';
import { displayMode } from '../reducers/board';

const styles = require('../css/find.less');

const Find = ({
  route, push, boards, params, user, displayMode, loadingBoards
}, { i18n, lang, fetcher }) => console.log(loadingBoards) ||
  <div className={styles.container}>
    <Header homeURL={stringify(uris.pages.root, { lang })} />
    <Background image={require('../images/bg.png')} >
      <Signature
        lead={i18n.find_to_meet}
        find={i18n.find_board}
        create={i18n.create}
        loadingBoards={loadingBoards}
        type="finding"
        onChangeFind={
          (evt) => {
            fetcher.board
              .gets({
                query: evt.target.value
              });
          }
        }
      />
      <Cards
        className={styles.list}
        items={
          boards.map(
            board => ({
              ...board,
              id: board.id,
              title: board.name,
              image: board.image
            })
          )
        }
        theme="pop"
        hover="cover"
        position="middle"
        onClick={
          (item) => {
            displayMode();
            push(stringify(uris.pages.board, { lang, id: item.id }));
          }
        }
      />
    </Background>
  </div>;

Find.propTypes = {
  route: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired,
  loadingBoards: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  displayMode: PropTypes.func.isRequired
};

Find.contextTypes = {
  lang: PropTypes.string.isRequired,
  i18n: PropTypes.object.isRequired,
  fetcher: PropTypes.object.isRequired
};


const connected = connect(
  state => ({
    boards: state.board.items,
    loadingBoards: state.board.loading,
    user: state.user.item
  }),
  {
    push,
    set,
    displayMode
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
