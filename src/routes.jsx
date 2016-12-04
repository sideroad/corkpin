import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Home from './containers/Home';
import Find from './containers/Find';
import SelectAlbum from './containers/SelectAlbum';
import PrivacyPolicy from './containers/PrivacyPolicy';
import Board from './containers/Board';
import NotFound from './containers/NotFound';
import uris from './uris';
import config from './config';
import { set } from './reducers/user';
import { get } from './helpers/auth';

export default (store, cookie) => {
  /**
   * Please keep routes in alphabetical order
   */
  const checkAuth = (nextState, replace, cb) => {
    const isLogin = store.getState().user &&
                    store.getState().user.item &&
                    store.getState().user.item.id;
    if (isLogin) {
      cb();
    } else {
      get(`${config.app.base}/auth`, cookie)
        .then(
          // login user
          (res) => {
            store.dispatch(set({
              id: res.id,
              token: res.token
            }));
            cb();
          },
          () => {
            cb();
          }
        );
    }
  };
  const login = (nextState, replace, cb) => {
    checkAuth(nextState, replace, () => {
      const isLogin = store.getState().user &&
                      store.getState().user.item &&
                      store.getState().user.item.id;
      if (isLogin) {
        cb();
      } else {
        cookie.set('redirect', nextState.location.pathname, {
          path: '/'
        });
        if (__SERVER__) {
          replace('/auth/facebook');
        } else {
          location.href = `${config.app.base}/auth/facebook`;
        }
        cb();
      }
    });
  };

  return (
    <Route path={uris.pages.root} component={App} >
      <IndexRoute component={Home} onEnter={checkAuth} />
      <Route path={uris.pages.privacy} component={PrivacyPolicy} />
      <Route path={uris.pages.finding} component={Find} onEnter={login} />
      <Route path={uris.pages.creating} component={SelectAlbum} onEnter={login} />
      <Route path={uris.pages.board} component={Board} onEnter={login} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
