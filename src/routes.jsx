import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Home from './containers/Home';
import SelectAlbum from './containers/SelectAlbum';
import PrivacyPolicy from './containers/PrivacyPolicy';
import Board from './containers/Board';
import NotFound from './containers/NotFound';
import uris from './uris';
import config from './config';
import { set } from './reducers/user';

export default (store, cookie) => {
  /**
   * Please keep routes in alphabetical order
   */
  const getAuth = (nextState, replace, cb) => {
    console.log(nextState);
    if (cookie.get('token')) {
      store.dispatch(set({
        id: cookie.get('id'),
        token: cookie.get('token')
      }));
      cb();
    } else {
      cookie.set('redirect', '/');
      if (__SERVER__) {
        replace('/auth/facebook');
      } else {
        location.href = `${config.app.base}/auth/facebook`;
      }

      cb();
    }
  };

  return (
    <Route path={uris.pages.root} component={App} >
      <IndexRoute component={Home} />
      <Route path={uris.pages.privacy} component={PrivacyPolicy} />
      <Route path={uris.pages.finding} component={Home} />
      <Route path={uris.pages.creating} component={SelectAlbum} onEnter={getAuth} />
      <Route path={uris.pages.board} component={Board} onEnter={getAuth} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
