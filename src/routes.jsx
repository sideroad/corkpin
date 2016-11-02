import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { stringify } from 'koiki';

import App from './containers/App';
import Home from './containers/Home';
import SelectAlbum from './containers/SelectAlbum';
import Board from './containers/Board';
import NotFound from './containers/NotFound';
import uris from './uris';
import login from './helpers/login';
import { set } from './reducers/user';

export default (store, cookie) => {
  /**
   * Please keep routes in alphabetical order
   */
  const getAuth = (nextState, replace, cb) => {
    const user = store.getState().user;
    if (user.item.id) {
      cb();
    } else {
      login(cookie).then(
        (res) => {
          console.log(res);
          store.dispatch(set(res));
          cb();
        },
        (err) => {
          console.log(err);
          replace(stringify(uris.pages.root, nextState.params));
          cb();
        }
      );
    }
  };

  return (
    <Route path={uris.pages.root} component={App} >
      <IndexRoute component={Home} />
      <Route path={uris.pages.finding} component={Home} />
      <Route path={uris.pages.creating} component={SelectAlbum} onEnter={getAuth} />
      <Route path={uris.pages.board} component={Board} onEnter={getAuth} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
