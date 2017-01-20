import React, { PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import 'koiki-ui/build/styles.css';
import config from '../config';

const App = props =>
  <div>
    {props.children}
    <Helmet {...config.app.head} title="Memorial board forever" />
  </div>;

App.propTypes = {
  children: PropTypes.element,
};

export default asyncConnect([{
  promise: () => {
    const promises = [];
    return Promise.all(promises);
  }
}])(App);
