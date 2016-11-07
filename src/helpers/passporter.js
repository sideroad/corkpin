/*eslint no-underscore-dangle: ["error", { "allow": ["_json"] }]*/
import passport from 'passport';
import { Strategy } from 'passport-facebook';
import config from '../config';

export default {

  setup: () => {
    // passport setup Strategy
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

    passport.use(new Strategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.secret,
      callbackURL: `${config.app.base}/auth/facebook/callback`,
      profileFields: ['id', 'albums', 'photos']
    }, (accessToken, refreshToken, profile, cb) =>
      cb(null, { ...profile, token: accessToken })
    ));
  },

  use: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/facebook',
      passport.authenticate('facebook', { scope: ['user_photos'] }));

    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { scope: ['user_photos'], failureRedirect: '/auth/facebook' }),
      (req, res) => {
        // Successful authentication, redirect home.
        const redirect = req.cookies.redirect;
        res.cookie('token', req.user.token);
        if (redirect) {
          res.redirect(redirect);
        } else {
          res.redirect('/');
        }
      });
  }
};
