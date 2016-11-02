/*global FB*/
/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import { client } from 'koiki';
import 'react-fastclick';

import routes from './routes';
import urls from './urls';
import reducers from './reducers';
import config from './config';

client({
  urls,
  reducers,
  routes,
  isDevelopment: __DEVELOPMENT__
});

window.fbAsyncInit = function fbAsyncInit() {
  FB.init({
    appId: config.facebook.appId,
    status: true,
    xfbml: true,
    cookie: true,
    version: 'v2.8'
  });
};

(function init(d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  const js = d.createElement(s); js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
